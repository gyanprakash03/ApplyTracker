import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Linkedin, Pencil, Trash2 } from "lucide-react";

const CompanyCard = ({ company, onDelete }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center -my-3">
        <div>
          <CardTitle className={"text-2xl"}>{company.name}</CardTitle>
          {company.country && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="w-3" />
              {company.country}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
        <Button
            variant="secondary"
            size="icon"
            aria-label="Delete company"
            className={"cursor-pointer"}
          >
            <Pencil className="w-4 h-4"/>
          </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(company.id)}
            aria-label="Delete company"
            className={"cursor-pointer"}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="py-3 border-y text-sm text-muted-foreground">
          {company.about || "No description yet."}
        </p>
        <div className="flex justify-start pt-4 gap-8">
          {company.careerUrl && (
            <a
              href={company.careerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline text-sm"
            >
                <ExternalLink className="w-4" />
              Career Page
            </a>
          )}
          {company.linkedinUrl && (
            <a
              href={company.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline items-center gap-1 flex text-sm"
            >
            <Linkedin className="w-4"/>
              LinkedIn
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
