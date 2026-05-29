import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

export default function CampDatePicker() {
  const [value, setValue] = useState(new Date());

  return (
    <div>
      <DatePicker
        format="DD/MM/YYYY HH:mm"
        plugins={[<TimePicker position="bottom" />]}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
