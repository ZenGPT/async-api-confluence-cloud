export default function PureApiDocItem(props: any) {
  return (
    <a href="/" onClick={props.onClick}
       className="hover:bg-blue-500 hover:border-transparent hover:shadow-lg group block rounded-lg p-4 border border-gray-200">
      <dl className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
        <div>
          <dt className="sr-only">Title</dt>
          <dd className="group-hover:text-white leading-6 font-medium text-black">
            Title {props.title}
          </dd>
        </div>
        <div>
          <dt className="sr-only">ID</dt>
          <dd className="group-hover:text-gray-200 text-sm font-medium sm:mb-4 lg:mb-0 xl:mb-4">
            ID {props.id}
          </dd>
        </div>
        <div className="col-start-2 row-start-1 row-end-3">
          <dt className="sr-only">Users</dt>
          <dd className="group-hover:text-gray-200 flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2">
            Peng
          </dd>
        </div>
      </dl>
    </a>
  );
}