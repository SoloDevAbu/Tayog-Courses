"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, Image as ImageIcon } from "lucide-react";
import { useResources, type StudentResource } from "@/hooks/student/resources/useResources";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function StudentResourcesGrid() {
  const { data: resources = [], isLoading } = useResources();
  const [viewingResource, setViewingResource] = React.useState<StudentResource | null>(null);

  const handleDownload = (attachment: string) => {
    window.open(attachment, '_blank');
  };

  const handleView = (resource: StudentResource) => {
    setViewingResource(resource);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading resources...
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No resources found.
      </div>
    );
  }

  const resourceTypeMap: Record<string, { icon: "pdf" | "video" | "image"; label: string }> = {
    PDF_DOCUMENT: { icon: "pdf", label: "PDF DOCUMENT" },
    VIDEO_CLASS: { icon: "video", label: "VIDEO CLASS" },
    IMAGE: { icon: "image", label: "IMAGE" },
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const typeInfo = resourceTypeMap[resource.type] || { icon: "pdf" as const, label: resource.type };
          const isToday = new Date(resource.createdAt).toDateString() === new Date().toDateString();
          const addedDate = isToday ? "Added Today" : format(new Date(resource.createdAt), "MMM dd, yyyy");

          return (
            <Card 
              key={resource.id} 
              className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
              onClick={() => handleView(resource)}
            >
              <CardContent className="p-0">
                {/* Thumbnail Preview for Images and Videos */}
                {(typeInfo.icon === "image" || typeInfo.icon === "video") && (
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    {typeInfo.icon === "image" ? (
                      <img
                        src={resource.attachment}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative w-full h-full bg-black">
                        <video
                          src={resource.attachment}
                          className="w-full h-full object-cover opacity-90"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Video className="h-8 w-8 text-red-600" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-black/60 rounded backdrop-blur-sm">
                        {typeInfo.label}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Icon for PDF */}
                  {typeInfo.icon === "pdf" && (
                    <div className="mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-100">
                        <FileText className="h-6 w-6 text-amber-800" />
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>

                  {/* Type for PDF */}
                  {typeInfo.icon === "pdf" && (
                    <p className="text-xs text-muted-foreground uppercase mb-4">
                      {typeInfo.label}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      {addedDate}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(resource.attachment);
                        }}
                        className="h-8"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(resource);
                        }}
                        className="h-auto p-0 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Content &gt;
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* File Viewer Dialog - LinkedIn Style */}
      <Dialog open={!!viewingResource} onOpenChange={(open) => !open && setViewingResource(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold">{viewingResource?.title}</DialogTitle>
            {viewingResource && (
              <p className="text-sm text-muted-foreground mt-1">
                {resourceTypeMap[viewingResource.type]?.label}
              </p>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            {viewingResource && (
              <div className="flex justify-center items-center min-h-[60vh]">
                {viewingResource.type === "PDF_DOCUMENT" && (
                  <iframe
                    src={viewingResource.attachment}
                    className="w-full h-[75vh] border rounded-lg shadow-lg bg-white"
                    title={viewingResource.title}
                  />
                )}
                {viewingResource.type === "VIDEO_CLASS" && (
                  <div className="w-full max-w-4xl">
                    <video
                      src={viewingResource.attachment}
                      controls
                      controlsList="nodownload"
                      className="w-full h-auto max-h-[75vh] rounded-lg shadow-lg bg-black"
                      preload="metadata"
                      playsInline
                      crossOrigin="anonymous"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {viewingResource.type === "IMAGE" && (
                  <div className="flex justify-center w-full">
                    <img
                      src={viewingResource.attachment}
                      alt={viewingResource.title}
                      className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                      loading="eager"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {viewingResource && (
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white">
              <Button
                variant="outline"
                onClick={() => {
                  if (viewingResource.attachment) {
                    window.open(viewingResource.attachment, '_blank');
                  }
                }}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

