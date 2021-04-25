import React from 'react';
import Button from "@atlaskit/button";
import EditIcon from "@atlaskit/icon/glyph/edit";

export default function ViewerHeader() {
  return (
    <>
      <div className="m-1 text-right">
        <Button
          iconBefore={<EditIcon label="Edit icon" size="small" />}
          appearance="primary"
        >
          Edit
        </Button>
      </div>
    </>
  );
}