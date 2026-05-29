const InfoRowLink = ({ label, url }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-md text-sm">{label} :</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm"
        >
          {url}
        </a>
      ) : (
        "N/A"
      )}
    </div>
  );
};

export default InfoRowLink;
