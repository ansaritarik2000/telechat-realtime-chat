import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const API = "hcpxd5chraac9asdllz6l6ko2pe4totqnv1h5zjgg08x0bm3";

export default function TinyEditor() {
  return (
    <>
      <Editor
        apiKey={API}
        initialValue="<p>Type you message here</p>"
        init={{
          height: 400,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </>
  );
}
