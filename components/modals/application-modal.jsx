"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, set } from "date-fns";
import { Contact, ExternalLink, Linkedin, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BounceLoader } from "react-spinners";
import { useState } from "react";

export default function ApplicationModal({
  app,
  deleteFn,
  onOpenChange,
  loading,
}) {
  if (!app) return null;

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Loading state for delete action
  const handleDelete = async () => {
    await deleteFn(app.id);
    onOpenChange();
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      {loading ? (
        <BounceLoader color="#a9afff" size={80} />
      ) : (
        <>
          <DialogHeader>
            <DialogTitle className="text-2xl uppercase">
              {app.company}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-1">
            <h3 className="flex gap-4 justify-center font-medium text-center text-gray-400">
              <div className="flex gap-1 items-center">
                <Contact className="w-4"/>
                {app.role}
              </div>
              |
              <div className="flex gap-1 items-center">
                <MapPin className="w-4"/>
                {app.location}
              </div>
            </h3>
            <div className="flex justify-evenly border-t pt-3 gap-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Type
                </span>{" "}
                : {app.jobType}
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Status
                </span>{" "}
                : {app.status}
              </div>
            </div>

            <div className="flex justify-evenly gap-4 border-t pt-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Applied Date
                </h4>
                <p>{format(new Date(app.appliedDate), "dd/MM/yyyy")}</p>
              </div>
              {app.deadline && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Deadline
                  </h4>
                  <p>{new Date(app.deadline).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {app.notes && (
              <div className="border-t py-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Notes
                </h4>
                <p className="whitespace-pre-line">{app.notes}</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Job Posting
                  </a>
                </Button>
                {app.linkedinUrl && (
                  <Button variant="outline" asChild>
                    <a
                      href={app.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
              <Button
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
            {confirmDelete && (
              <div className="text-center border-t pt-2">
                <p className="text-[1.1rem] text-destructive mt-2">
                  Are you sure? This action cannot be undone.
                </p>
                <Button
                  variant="link"
                  className="text-red-400 text-[1rem]"
                  onClick={() => handleDelete(app.id)}
                  disabled={loading}
                >
                  Yes, Delete
                </Button>
                <Button
                  variant="link"
                  className="text-[1rem] text-muted-foreground"
                  onClick={() => setConfirmDelete(false)}
                  disabled={loading}
                >
                  No, Cancel
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </DialogContent>
  );
}
