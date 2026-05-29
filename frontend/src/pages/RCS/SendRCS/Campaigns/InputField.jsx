export default function InputField({ title, fieldtype, helper }) {
  return (
    <div>
      <label
        htmlFor={fieldtype}
        className="block text-sm font-medium leading-6"
      >
        {title}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name={fieldtype}
          id={fieldtype}
          className="block md:w-2/3 rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
          aria-describedby="name-description"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500" id="email-description">
        {helper}
      </p>
    </div>
  );
}
