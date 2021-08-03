import Button from "@atlaskit/button";
import EditIcon from "@atlaskit/icon/glyph/edit";

export default function ViewerHeader() {
  function editApiDoc() {
    // @ts-ignore
    AP.dialog.create({
      key: 'editApiDoc',
      chrome: false
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