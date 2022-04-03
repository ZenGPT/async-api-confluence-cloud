export default function PureApiDocItem(props: any) {
  return (
    <>
      <div
        key={props.id}
        className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden"
        onClick={props.onClick}
      >
        <div className="flex-1 p-4 space-y-2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900">
            <a href="/">
              <span aria-hidden="true" className="absolute inset-0" />
              {props.title}
            </a>
          </h3>
          <p className="text-sm text-gray-500">{props.description}</p>
          <div className="flex-1 flex flex-col justify-end">
            <p className="text-sm italic text-gray-500">{props.id}</p>
            <p className="text-base font-medium text-gray-900">{props.version}</p>
          </div>
        </div>
      </div>
    </>
  );
}