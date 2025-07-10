"use client";

import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect } from "react";

const statusOptions = [
  { value: "any", label: "Any" },
  { value: "Applied", label: "Applied" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
  { value: "Ghosted", label: "Ghosted" },
];

const jobTypeOptions = [
  { value: "any", label: "Any" },
  { value: "FullTime", label: "Full-time" },
  { value: "PartTime", label: "Part-time" },
  { value: "Internship", label: "Internship" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
];

const FilterModal = ({
  open,
  onOpenChange,
  onSubmit,
  filters = {},
  setFilters,
  loading,
}) => {
  const form = useForm({
    defaultValues: {
      status: filters.status || "any",
      jobType: filters.jobType || "any",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        status: filters.status || "any",
        jobType: filters.jobType || "any",
      });
    }
  }, [open]);

  const handleApply = (data) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const handleClear = () => {
    const cleared = { status: "", jobType: "" };
    form.reset(cleared);
    handleApply(cleared);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Filter Applications</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleApply)}>
          <div className="flex justify-around items-center">
            {/* Status Filter */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Job Type Filter */}
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={loading}
            >
              Clear Filters
            </Button>
            <Button type="submit" disabled={loading}>
              Apply
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default FilterModal;
