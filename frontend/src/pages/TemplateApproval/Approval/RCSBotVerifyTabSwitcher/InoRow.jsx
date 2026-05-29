const InfoRow = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-md text-sm text-default-800">{label} :</span>
      <span className="text-default-500 text-sm">{value || "N/A"}</span>
    </div>
  );
};

export default InfoRow;
