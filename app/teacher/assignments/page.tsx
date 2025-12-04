"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateAssignmentDialog } from "./create-assignment-dialog";

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  attachment?: string;
  submissions: number;
}

const assignments: Assignment[] = [
  {
    id: "1",
    title: "History of Thermodynamics",
    dueDate: "2023-11-15",
    attachment: "thermo_guide.pdf",
    submissions: 2,
  },
  {
    id: "2",
    title: "Calculus Worksheet 4",
    dueDate: "2023-11-20",
    submissions: 0,
  },
];

export default function AssignmentsPage() {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Create and grade coursework
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setDialogOpen(true)}
        >
          + Create Assignment
        </Button>
      </div>

      <CreateAssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Assignment Cards List */}
      <div className="space-y-3">
        {assignments.map((assignment) => (
          <Collapsible
            key={assignment.id}
            open={expandedId === assignment.id}
            onOpenChange={(open) => setExpandedId(open ? assignment.id : null)}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger asChild>
                <CardContent
                  className={cn(
                    "p-4 cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    expandedId === assignment.id && "bg-accent/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-2 truncate">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Due: {assignment.dueDate}</span>
                        </div>
                        {assignment.attachment && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            {assignment.attachment}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold leading-none">
                          {assignment.submissions}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                          Submissions
                        </span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                          expandedId === assignment.id && "rotate-90"
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  {/* Student Submissions Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Student Submissions
                    </h4>

                    {/* Student Submission Card */}
                    {assignment.submissions > 0 ? (
                      <Card className="border-2">
                        <CardContent className="p-4 space-y-4">
                          {/* Student Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  AJ
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">
                                Alice Johnson
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Graded: 85/100
                            </Badge>
                          </div>

                          {/* Submission Preview */}
                          <div className="p-3 bg-muted/50 rounded-md border text-xs text-muted-foreground leading-relaxed">
                            Thermodynamics is the branch of physics that deals
                            with heat, work, and temperature, and their relation
                            to energy, entropy, and the physical properties of
                            matter and radiation...
                          </div>

                          {/* Feedback Section */}
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider">
                              Feedback
                            </Label>
                            <Textarea
                              placeholder="Add your feedback here..."
                              defaultValue="Good overview, but you missed the 3rd law."
                              className="min-h-[80px] text-sm"
                            />
                          </div>

                          {/* Grade and Action */}
                          <div className="flex items-center gap-3 pt-2">
                            <div className="flex items-center gap-1.5">
                              <Input
                                type="number"
                                defaultValue="85"
                                className="w-16 h-8 text-sm"
                              />
                              <span className="text-sm text-muted-foreground">
                                /100
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 h-8"
                            >
                              Return to Student
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-6 text-sm text-muted-foreground">
                        No submissions yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
