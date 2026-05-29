import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Input,
    Select,
    SelectItem,
    Button,
    Autocomplete,
    AutocompleteItem,
    Avatar,
} from "@heroui/react";
import { states } from "../../../constants/states.js";
import { useTranslation } from "react-i18next";
import { useSubAccountStore } from "../../../store/subAccount/subAccountStore.js";
import { countries } from "../../../services/common/index.js";
import { z } from "zod";

const schema = z.object({
    business_name: z
        .string()
        .min(2, "Please enter valid organization name")
        .regex(/^[A-Za-z\s]+$/, "Please enter valid organization name"),
    pan_no: z
        .string()
        .min(10, "Please enter valid PAN number")
        .max(14, "Please enter valid PAN number")
        .regex(/^[A-Z0-9]+$/, "Please enter valid PAN number"),
    gst_no: z
        .string()
        .min(15, "Please enter valid GST number")
        .max(15, "Please enter valid GST number")
        .regex(/^[A-Z0-9]+$/, "Please enter valid GST number"),
    dlt_entity_id: z
        .string()
        .min(21, "Please enter valid CIN No.")
        .max(21, "Please enter valid CIN No.")
        .regex(/^\d+$/, "Please enter valid CIN No."),
    address: z.string().min(5, "Please enter valid address"),
    city: z.string().min(2, "Please enter valid city"),
    state: z.string().min(2, "Please enter valid state"),
    pin: z.string().regex(/^\d{6}$/, "Please enter valid PIN"),
    country: z.string().min(2, "Please enter valid country"),
});

export default function CompanyDetails() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(schema),
        mode: "all", // Validate on change
    });

    // Access state and setters from the zustand store
    const {
        business_name,
        pan_no,
        gst_no,
        dlt_entity_id,
        address,
        city,
        state,
        pin,
        country,
        url,
        setBusinessName,
        setPanNo,
        setGstNo,
        setDltEntityId,
        setAddress,
        setCity,
        setState,
        setPin,
        setCountry,
        setUrl,
    } = useSubAccountStore();

    const { t } = useTranslation();

    return (
        <form>
            <div className="flex flex-col gap-4 ">
                {/* Blue Fields  */}
                <div className="flex flex-col gap-4">
                    <Input
                        isRequired
                        {...register("business_name")}
                        label={t("Organization Name")}
                        value={business_name}
                        errorMessage={errors?.business_name?.message}
                        isInvalid={errors?.business_name ? true : false}
                        onChange={(e) => setBusinessName(e.target.value)}
                        size="md"
                        className="w-full hover:cursor-not-allowed"
                        color="primary"
                        radius="sm"
                    />
                    <div className="flex gap-2">
                        <Input
                            isRequired
                            {...register("pan_no")}
                            value={pan_no}
                            onChange={(e) =>
                                setPanNo(e.target.value.toUpperCase())
                            }
                            label={t("PAN No")}
                            size="md"
                            className="w-1/3"
                            color="primary"
                            radius="sm"
                            isInvalid={errors?.pan_no ? true : false}
                            errorMessage={errors?.pan_no?.message}
                        />
                        <Input
                            {...register("gst_no")}
                            isRequired
                            label={t("GST No")}
                            size="md"
                            className="w-1/3"
                            value={gst_no}
                            isInvalid={errors?.gst_no ? true : false}
                            errorMessage={errors?.gst_no?.message}
                            onChange={(e) =>
                                setGstNo(e.target.value.toUpperCase())
                            }
                            color="primary"
                            radius="sm"
                        />
                        <Input
                            {...register("dlt_entity_id")}
                            isRequired
                            label={t("CIN No.")}
                            type="text"
                            variant="flat"
                            isInvalid={errors?.dlt_entity_id ? true : false}
                            errorMessage={errors?.dlt_entity_id?.message}
                            className="w-1/3"
                            radius="sm"
                            color="primary"
                            value={dlt_entity_id}
                            onChange={(e) => setDltEntityId(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Address */}
                    <Input
                        {...register("address")}
                        isRequired
                        label={t("Address")}
                        isInvalid={errors?.address ? true : false}
                        errorMessage={errors?.address?.message}
                        size="sm"
                        className="w-full"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        color="default"
                    />
                    <div className="flex gap-2">
                        {/* City */}
                        <Input
                            {...register("city")}
                            isRequired
                            label={t("City")}
                            isInvalid={errors?.city ? true : false}
                            errorMessage={errors?.city?.message}
                            size="sm"
                            className="w-1/2"
                            color="default"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        {/* Select State  */}
                        <Select
                            {...register("state")}
                            isRequired
                            size="sm"
                            isInvalid={errors?.state ? true : false}
                            errorMessage={errors?.state?.message}
                            label={t("State")}
                            className="w-1/2"
                            onChange={(e) => setState(e.target.value)}
                            scrollShadowProps={{
                                isEnabled: false,
                            }}>
                            {states.map((state) => (
                                <SelectItem key={state.key} value={state.key}>
                                    {state.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Autocomplete
                            {...register("country")}
                            allowsCustomValue={true}
                            inputValue={country}
                            className="max-w-xs"
                            defaultItems={countries}
                            onInputChange={(value) => setCountry(value)}
                            isRequired
                            defaultSelectedKey={country}
                            selectedKey={country}
                            errorMessage={errors?.country?.message}
                            isInvalid={errors?.country ? true : false}
                            label="Select Country"
                            labelPlacement="inside"
                            placeholder="Select a country"
                            variant="bordered">
                            {(country) => (
                                <AutocompleteItem
                                    key={country.name}
                                    textValue={country.name}>
                                    <div className="flex gap-2 items-center">
                                        <Avatar
                                            alt={country.name}
                                            className="flex-shrink-0"
                                            size="sm"
                                            src={country.flag}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-small">
                                                {country.name}
                                            </span>
                                            <span className="text-tiny text-default-400">
                                                {country.code}
                                            </span>
                                        </div>
                                    </div>
                                </AutocompleteItem>
                            )}
                        </Autocomplete>
                        {/* PIN Code */}
                        <Input
                            {...register("pin")}
                            isRequired
                            label={t("PIN")}
                            isInvalid={errors?.pin ? true : false}
                            errorMessage={errors?.pin?.message}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            size="sm"
                            className="w-1/3"
                            color="default"
                        />

                        {/* Website  */}
                        <Input
                            type="text"
                            size="lg"
                            value={url}
                            placeholder="company.com"
                            onChange={(e) => setUrl(e.target.value)}
                            variant="flat"
                            className="w-1/3"
                            radius="sm"
                            startContent={"https://"}
                        />
                    </div>
                </div>

                <div>
                    <span className="text-xs text-default-400">
                        <span className="text-primary">*</span>
                        {t(
                            "Blue fields once set, cannot be changed by end user."
                        )}
                    </span>
                </div>

                {/* Btn */}
                {/* <div className="w-full flex justify-end">
        <Button size="sm" color="success" variant="flat">
          Save
        </Button>
      </div> */}
            </div>
        </form>
    );
}
