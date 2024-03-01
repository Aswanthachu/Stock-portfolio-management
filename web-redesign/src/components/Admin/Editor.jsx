import { Editor as Edtr } from "@tinymce/tinymce-react";

const Editor = ({ formData, handleChange ,openDrawer}) => {
  const handleEditorChange = (content, editor) => {
    const e = {
      target: {
        name: "message",
        value: content,
      },
    };
    handleChange(e);
  };

  return (
    <>
      <h1 className="font-semibold ml-1 -mb-4">Message</h1>
      <Edtr
        id="editor"
        apiKey="lr8zrmdh2m3ruite4bk9zmtophmutlmxgrtgeotseocwgh3k"
        value={formData?.message}
        onClick={openDrawer}
        init={{
          directionality: "ltr",
          plugins: "lists link paste help wordcount emoticons",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link  table mergetags | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | emoticons charmap | help | forecolor backcolor",
        }}
        onEditorChange={handleEditorChange}
      />
    </>
  );
};

export default Editor;
