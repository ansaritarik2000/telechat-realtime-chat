import { create } from "zustand";

// sub account store
export const useSubAccountStore = create((set) => {
    const initialState = {
        // company details and user details
        business_name: "",
        userId: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone_no: "",
        country_dial_code: "+91",
        role: "",
        max_sub_acc: 0,
        rel_mng_name: "",
        rel_mng_phone: "",
        rel_mng_email: "",
        rel_mng_country_dial_code: "+91",
        pan_no: "",
        gst_no: "",
        dlt_entity_id: "",
        address: "",
        city: "",
        state: "",
        pin: "",
        country: "",
        status: "active",
        url: "",
        avatar_value: "",
        avatar_type: "character",
        // sms service pricing
        sms_promo_credits: null,
        sms_promo_credits_billing_on: undefined,
        sms_transactional_rates: null,
        sms_transactional_rates_billing_on: undefined,
        sms_otp_credits: null,
        sms_otp_credits_billing_on: undefined,
        sms_global_credits: null,
        sms_global_credits_billing_on: undefined,
        sms_billing_method: "prepaid",
        // RCS pricing parameters
        rcs_text_credits: null,
        rcs_text_credits_billing_on: undefined,
        rcs_multimedia_credits: null,
        rcs_multimedia_credits_billing_on: undefined,
        rcs_billing_method: "prepaid",
        // WhatsApp pricing parameters
        marketing_rate: null,
        marketing_rate_billing_on: undefined,
        utility_rate: null,
        utility_rate_billing_on: undefined,
        authentication_rate: null,
        authentication_rate_billing_on: undefined,
        service_rate: null,
        service_rate_billing_on: undefined,
        whatsapp_billing_method: "prepaid",
        // Email service pricing parameters
        email_promo_credits: null,
        email_promo_credits_billing_on: undefined,
        email_transactional_rates: null,
        email_transactional_rates_billing_on: undefined,
        email_email_billing_method: "prepaid",
        // credit and history parameters
        auto_add_credits: true,
    };

    return {
        ...initialState,

        // Setters for company details and user details
        setUserId: (userId) => set((state) => ({ ...state, userId: userId })),
        setBusinessName: (name) =>
            set((state) => ({ ...state, business_name: name })),
        setEmail: (email) => set((state) => ({ ...state, email: email })),
        setPassword: (password) =>
            set((state) => ({ ...state, password: password })),
        setFirstName: (first_name) =>
            set((state) => ({ ...state, first_name: first_name })),
        setLastName: (last_name) =>
            set((state) => ({ ...state, last_name: last_name })),
        setPhoneNo: (phone_no) =>
            set((state) => ({ ...state, phone_no: phone_no })),
        setCountryDialCode: (country_dial_code) =>
            set((state) => ({
                ...state,
                country_dial_code: country_dial_code,
            })),
        setRole: (role) => set((state) => ({ ...state, role: role })),
        setMaxSubAcc: (max_sub_acc) =>
            set((state) => ({ ...state, max_sub_acc: max_sub_acc })),
        setRelMngName: (rel_mng_name) =>
            set((state) => ({ ...state, rel_mng_name: rel_mng_name })),
        setRelMngPhone: (rel_mng_phone) =>
            set((state) => ({ ...state, rel_mng_phone: rel_mng_phone })),
        setRelMngCountryDialCode: (rel_mng_country_dial_code) =>
            set((state) => ({
                ...state,
                rel_mng_country_dial_code: rel_mng_country_dial_code,
            })),
        setRelMngEmail: (rel_mng_email) =>
            set((state) => ({ ...state, rel_mng_email: rel_mng_email })),
        setPanNo: (pan_no) => set((state) => ({ ...state, pan_no: pan_no })),
        setGstNo: (gst_no) => set((state) => ({ ...state, gst_no: gst_no })),
        setDltEntityId: (dlt_entity_id) =>
            set((state) => ({ ...state, dlt_entity_id: dlt_entity_id })),
        setAddress: (address) =>
            set((state) => ({ ...state, address: address })),
        setCity: (city) => set((state) => ({ ...state, city: city })),
        setState: (stateVal) => set((state) => ({ ...state, state: stateVal })),
        setPin: (pin) => set((state) => ({ ...state, pin: pin })),
        setCountry: (country) =>
            set((state) => ({ ...state, country: country })),
        setUrl: (url) => set((state) => ({ ...state, url: url })),
        setStatus: (status) => set((state) => ({ ...state, status: status })),
        setAvatarType: (avatar_type) =>
            set((state) => ({ ...state, avatar_type: avatar_type })),
        setAvatarValue: (avatar_value) =>
            set((state) => ({ ...state, avatar_value: avatar_value })),
        // Setters for SMS service pricing
        setSmsPromoCredits: (sms_promo_credits) =>
            set((state) => ({
                ...state,
                sms_promo_credits: sms_promo_credits,
            })),
        setSmsPromoCreditsBillingOn: (sms_promo_credits_billing_on) =>
            set((state) => ({
                ...state,
                sms_promo_credits_billing_on: sms_promo_credits_billing_on,
            })),
        setSmsTransactionalRates: (sms_transactional_rates) =>
            set((state) => ({
                ...state,
                sms_transactional_rates: sms_transactional_rates,
            })),
        setSmsTransactionalRatesBillingOn: (
            sms_transactional_rates_billing_on
        ) =>
            set((state) => ({
                ...state,
                sms_transactional_rates_billing_on:
                    sms_transactional_rates_billing_on,
            })),
        setSmsOtpCredits: (sms_otp_credits) =>
            set((state) => ({ ...state, sms_otp_credits: sms_otp_credits })),
        setSmsOtpCreditsBillingOn: (sms_otp_credits_billing_on) =>
            set((state) => ({
                ...state,
                sms_otp_credits_billing_on: sms_otp_credits_billing_on,
            })),
        setSmsGlobalCredits: (sms_global_credits) =>
            set((state) => ({
                ...state,
                sms_global_credits: sms_global_credits,
            })),
        setSmsGlobalCreditsBillingOn: (sms_global_credits_billing_on) =>
            set((state) => ({
                ...state,
                sms_global_credits_billing_on: sms_global_credits_billing_on,
            })),
        setSmsBillingMethod: (sms_billing_method) =>
            set((state) => ({
                ...state,
                sms_billing_method: sms_billing_method,
            })),

        // Setters for RCS pricing parameters
        setRcsTextCredits: (rcsTextPrice) =>
            set((state) => ({
                ...state,
                rcs_text_credits: rcsTextPrice,
            })),
        setRcsTextCreditsBillingOn: (rcs_text_credits_billing_on) =>
            set((state) => ({
                ...state,
                rcs_text_credits_billing_on: rcs_text_credits_billing_on,
            })),
        setRcsMultimediaCredits: (rcsMultimediaPrice) =>
            set((state) => ({
                ...state,
                rcs_multimedia_credits: rcsMultimediaPrice,
            })),
        setRcsMultimediaCreditsBillingOn: (rcs_multimedia_credits_billing_on) =>
            set((state) => ({
                ...state,
                rcs_multimedia_credits_billing_on:
                    rcs_multimedia_credits_billing_on,
            })),
        setRcsBillingMethod: (rcs_billing_method) =>
            set((state) => ({
                ...state,
                rcs_billing_method: rcs_billing_method,
            })),

        // Setters for WhatsApp pricing parameters
        setMarketingRate: (marketing_rate) =>
            set((state) => ({ ...state, marketing_rate: marketing_rate })),
        setMarketingRateBillingOn: (marketing_rate_billing_on) =>
            set((state) => ({
                ...state,
                marketing_rate_billing_on: marketing_rate_billing_on,
            })),
        setUtilityRate: (utility_rate) =>
            set((state) => ({ ...state, utility_rate: utility_rate })),
        setUtilityRateBillingOn: (utility_rate_billing_on) =>
            set((state) => ({
                ...state,
                utility_rate_billing_on: utility_rate_billing_on,
            })),
        setAuthenticationRate: (authentication_rate) =>
            set((state) => ({
                ...state,
                authentication_rate: authentication_rate,
            })),
        setAuthenticationRateBillingOn: (authentication_rate_billing_on) =>
            set((state) => ({
                ...state,
                authentication_rate_billing_on: authentication_rate_billing_on,
            })),
        setServiceRate: (service_rate) =>
            set((state) => ({ ...state, service_rate: service_rate })),
        setServiceRateBillingOn: (service_rate_billing_on) =>
            set((state) => ({
                ...state,
                service_rate_billing_on: service_rate_billing_on,
            })),
        setWhatsappBillingMethod: (whatsapp_billing_method) =>
            set((state) => ({
                ...state,
                whatsapp_billing_method: whatsapp_billing_method,
            })),

        // Setters for Email service pricing parameters
        setEmailPromoCredits: (email_promo_credits) =>
            set((state) => ({
                ...state,
                email_promo_credits: email_promo_credits,
            })),
        setEmailPromoCreditsBillingOn: (email_promo_credits_billing_on) =>
            set((state) => ({
                ...state,
                email_promo_credits_billing_on: email_promo_credits_billing_on,
            })),
        setEmailTransactionalRates: (email_transactional_rates) =>
            set((state) => ({
                ...state,
                email_transactional_rates: email_transactional_rates,
            })),
        setEmailTransactionalRatesBillingOn: (
            email_transactional_rates_billing_on
        ) =>
            set((state) => ({
                ...state,
                email_transactional_rates_billing_on:
                    email_transactional_rates_billing_on,
            })),
        setEmailBillingMethod: (email_email_billing_method) =>
            set((state) => ({
                ...state,
                email_email_billing_method: email_email_billing_method,
            })),

        // Setters for credit and history parameters
        setAutoAddCredits: (auto_add_credits) =>
            set((state) => ({ ...state, auto_add_credits: auto_add_credits })),
        // Reset function for all state
        resetSubAccounts: () => set(() => initialState),
    };
});
