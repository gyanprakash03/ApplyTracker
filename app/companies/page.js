"use client";
import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addCompanies,
  deleteCompany,
  getUserCompanies,
} from "@/actions/companies";
import CompanyCard from "./components/CompanyCard";
import { useServerAction } from "@/hooks/useServerAction";
import { BounceLoader } from "react-spinners";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [newCompany, setNewCompany] = useState("");

  const { call: fetchCompaniesFn, loading: fetchCompaniesLoading } =
    useServerAction(getUserCompanies);

  const { call: addCompanyFn, loading: addCompanyLoading } =
    useServerAction(addCompanies);

  const { call: deleteCompanyFn, loading: deleteCompanyLoading } =
    useServerAction(deleteCompany);

  // fetch companies on initial render
  useEffect(() => {
    const fetchCompanies = async () => {
      const data = await fetchCompaniesFn();
      if (data?.companies) {
        setAllCompanies(data.companies);
        setCompanies(data.companies);
      }
    };
    fetchCompanies();
  }, []);

  //   adding new companies
  const handleAdd = async () => {
    const newCompanies = newCompany.split(",").map((c) => c.trim());
    if (newCompanies.length === 0) {
      return;
    }

    const response = await addCompanyFn(newCompanies);

    if (response?.newCompanies) {
      setAllCompanies(response.newCompanies);
      setCompanies(response.newCompanies);
    }
    setNewCompany("");
  };

  // filter companies based on search input
  useEffect(() => {
    if (!search) {
      setCompanies(allCompanies);
      return;
    }
    const filtered = allCompanies.filter((company) =>
      company.name.toLowerCase().includes(search.toLowerCase())
    );
    setCompanies(filtered);
  }, [search]);

  // delete company
  const handleDelete = async (companyId) => {
    const response = await deleteCompanyFn(companyId);
    if (response?.success) {
      setAllCompanies((prev) => prev.filter((c) => c.id !== companyId));
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    }
  };

  return fetchCompaniesLoading || addCompanyLoading || deleteCompanyLoading ? (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] w-full">
      <BounceLoader color="#a9afff" size={120} />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Your Target Companies</h1>
      <p className="text-muted-foreground mb-6">
        Track companies you want to apply to. Add new companies and access their
        career pages easily.
      </p>
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add company name"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            className="w-64"
          />
          <Button
            onClick={handleAdd}
            className={"cursor-pointer"}
            disabled={addCompanyLoading || !newCompany.trim()}
          >
            Add
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.length === 0 ? (
          <p className="col-span-2 text-center text-muted-foreground">
            No companies found.
          </p>
        ) : (
          companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onDelete={(companyId) => handleDelete(companyId)}
              className="hover:shadow-lg transition-shadow"
            />
          ))
        )}
      </div>
    </div>
  );
}
