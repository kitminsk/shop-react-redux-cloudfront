import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    console.log("CSV import endpoint: ", url);

    const authToken = localStorage.getItem("authorization_token");

    if (file && authToken) {
      // Get the pre-signed URL.
      const response = await axios({
        method: "GET",
        url,
        headers: {
          Authorization: `Basic ${authToken}`,
        },
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      console.log("CSV filename: ", file.name);
      console.log("Pre-signed URL: ", response.data);

      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });

      console.log("CSV upload result: ", result.status);

      setFile(undefined);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
