
export const INITIAL_COURSES = [
    {
        name: "Normal Ceiling Fan",
        category: "Fans",
        level: "Skill Workshop",
        duration: "1 Month",
        image: "https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["Motor Winding", "Capacitor Changing", "Installation", "Speed Regulator Connection"],
        description: "Learn to repair and maintain standard ceiling fans, including winding and installation techniques.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "High-Speed Ceiling Fan",
        category: "Fans",
        level: "Skill Workshop",
        duration: "1 Month",
        image: "https://images.unsplash.com/photo-1723407652756-995ac0a14f08?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["High Speed Winding", "Bearing Replacement", "Balancing", "Troubleshooting"],
        description: "Master the repair of high-speed fans with a focus on precision winding and balancing.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Table Fan & Stand Fan",
        category: "Fans",
        level: "Skill Workshop",
        duration: "1 Month",
        image: "https://images.pexels.com/photos/42220/air-blade-blowing-chrome-42220.jpeg",
        subjects: ["Oscillation Mechanism", "Motor Repair", "Switch & Wiring", "Assembly"],
        description: "Comprehensive guide to fixing table and stand fans, covering motor and mechanical issues.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Cooler",
        category: "Cooling",
        level: "Certificate",
        duration: "1 Month",
        image: "https://images.unsplash.com/photo-1713874990887-6e76a16a2884?q=80&w=737&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["Pump Repair", "Motor Winding", "Wiring Diagram", "Body Maintenance"],
        description: "Learn complete maintenance and repair of air coolers, including motors and water pumps.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Domestic Motors",
        category: "Motors",
        level: "Certificate",
        duration: "2 Months",
        image: "https://images.unsplash.com/photo-1772588047051-c35d272b5d9c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["Tullu Pump", "Washing Machine Motor", "Small Pump Winding", "Testing"],
        description: "Hands-on training for various domestic motors found in household appliances.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Agriculture Motors",
        category: "Motors",
        level: "Professional",
        duration: "3 Months",
        image: "https://plus.unsplash.com/premium_photo-1764695559025-59a642c2b3c2?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["Submersible Pumps", "3-Phase Motor Winding", "Starters & Panels", "Field Maintenance"],
        description: "Specialized course for agricultural pump sets and heavy-duty 3-phase motors.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Domestic Mixer Grinder",
        category: "Appliances",
        level: "Skill Workshop",
        duration: "1 Month",
        image: "https://plus.unsplash.com/premium_vector-1769384618769-d7614b701edd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["Armature Winding", "Carbon Brush Replacement", "Coupler Changing", "Speed Control"],
        description: "Complete repair course for mixer grinders, covering motor and jar repair.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Geyser",
        category: "Appliances",
        level: "Certificate",
        duration: "15 Days",
        image: "https://plus.unsplash.com/premium_photo-1663047166207-fd717b9a0ba7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["Thermostat Setting", "Element Replacement", "Wiring Connection", "Safety Valves"],
        description: "Expert training on electric, gas, and instant geyser installation and repair.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Single Door Refrigerator",
        category: "Refrigeration",
        level: "Certificate",
        duration: "2 Months",
        image: "https://images.pexels.com/photos/5418581/pexels-photo-5418581.jpeg",
        subjects: ["Gas Charging", "Compressor Testing", "Relay & OLP", "Leakage Testing"],
        description: "Foundation course for refrigeration mechanics starting with single-door units.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Double Door Refrigerator",
        category: "Refrigeration",
        level: "Certificate",
        duration: "2 Months",
        image: "https://images.pexels.com/photos/31498413/pexels-photo-31498413.jpeg",
        subjects: ["Defrost System", "Timer & Bi-metal", "Fan Motor", "Troubleshooting"],
        description: "Learn the complexities of frost-free double door refrigerator systems.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Deep Refrigerator",
        category: "Refrigeration",
        level: "Professional",
        duration: "2 Months",
        image: "https://images.pexels.com/photos/8466649/pexels-photo-8466649.jpeg",
        subjects: ["Commercial Maintenance", "Capillary Sizing", "Thermostat Control", "Gas Charging"],
        description: "Commercial refrigeration training for deep freezers and chest coolers.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Inverter Refrigerator",
        category: "Refrigeration",
        level: "Diploma",
        duration: "3 Months",
        image: "https://images.unsplash.com/photo-1677296860174-5369253e7896?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["PCB Testing", "Inverter Compressor", "Error Codes", "Sensor Testing"],
        description: "Advanced course on modern inverter technology fridges and energy-efficient systems.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Full Service and Gas Charging",
        category: "Services",
        level: "Skill Workshop",
        duration: "1 Month",
        image: "https://plus.unsplash.com/premium_photo-1661342490985-26da70d07a52?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        subjects: ["Vacuumizing", "Gas Refilling", "Pressure Testing", "Leak Repair"],
        description: "Master the essential service skills for all types of refrigeration and cooling units.",
        instructor: "Mr. Nandan Jha"
    },
    {
        name: "Advanced PCB Repair",
        category: "Electronics",
        level: "Diploma",
        duration: "6 Months",
        image: "https://images.pexels.com/photos/12863114/pexels-photo-12863114.jpeg",
        subjects: ["Soldering", "Multi-meter Use", "Component Identification", "Tracing"],
        description: "Deep dive into electronics to troubleshoot and repair complex PCBs for appliances.",
        instructor: "Mr. Nandan Jha"
    }
];
