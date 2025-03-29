import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
const ValidationAlert = ({ closeAlert }: { closeAlert: () => void }) => {
  return (
    <div className="flex flex-row justify-center items-center w-max h-max left-1/2 transform -translate-x-1/2 absolute top-4 z-100 backdrop-blur-sm shadow-md rounded-md">
      <Alert variant="destructive">
        <div className="flex flex-row gap-4 justify-center items-center">
          <AlertCircle className="h-4 w-4" />
          <div className="flex flex-col justify-center items-start gap-0">
            <AlertTitle>Cannnot Submit Blog!</AlertTitle>
            <AlertDescription>
              Make sure all fields are filled and have correct data
            </AlertDescription>
          </div>
          <X onClick={closeAlert} size={14} className="hover:cursor-pointer" />
        </div>
      </Alert>
    </div>
  );
};

export default ValidationAlert;
