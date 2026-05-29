const PulsatingDot = ({ color = "success" }) => {
    return (
        <div className="relative h-3 w-3">
            {/* Pulsing outer ring */}
            <div
                className={`absolute inset-0 rounded-full bg-${color} opacity-75 animate-ping`}
            ></div>

            {/* Static center dot */}
            <div
                className={`absolute inset-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-${color} z-10`}
            ></div>
        </div>
    );
};

export default PulsatingDot;
