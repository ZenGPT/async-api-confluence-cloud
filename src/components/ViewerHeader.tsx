import Button from "@atlaskit/button";
import EditIcon from "@atlaskit/icon/glyph/edit";
import queryString from "query-string";

export default function ViewerHeader() {
  function editApiDoc() {
    console.log("edit api doc");
    let query = queryString.parse(window.location.search);
    const contentId = query.contentId;

    // @ts-ignore
    AP.dialog.create({
      key: 'editApiDoc',
      chrome: false,
      customData: {
        contentId
      }
    });
  }

  return (
    <>
      <div className="m-1 text-right">
        <Button
          iconBefore={<EditIcon label="Edit icon" size="small" />}
          appearance="primary"
          onClick={editApiDoc}
        >
          Edit
        </Button>
      </div>
    </>
  );
}