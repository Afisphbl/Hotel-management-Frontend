import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function RolesHeader() {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div>
        <h2 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
          Security
        </h2>
        <p className='text-sm text-muted-foreground mt-1'>
          Manage administrative access control.
        </p>
      </div>
      <Button className='w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]'>
        <Plus className='w-4 h-4 mr-2' /> Add Role
      </Button>
    </div>
  );
}
