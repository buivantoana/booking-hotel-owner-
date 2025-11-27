import { Button, Container, Typography } from '@mui/material'
import React, { useState } from 'react'
import LoginIcon from '@mui/icons-material/Login';
type Props = {}

const CreateHotelView = (props: Props) => {
    const [step, setStep] = useState(1);
    const [typeHotel, setTypeHotel] = useState("Khách sạn Listing");

    const handleStepClick = (id) => {
        console.log("Bạn vừa chọn step:", id);
        setStep(id);
    };
    const handleSelectType = (name) => {
        console.log("Bạn đã chọn loại khách sạn", name);
        setTypeHotel(name)
    };
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography fontSize={"32px"} fontWeight={"600"}>
                Tạo khách sạn
            </Typography>
            <Typography fontSize={"16px"} mt={1} color='#989FAD' >
                Để bắt đầu, vui lòng nhập các thông tin bên dưới về khách sạn của bạn.
            </Typography>
            <StepIndicator activeStep={step} onStepChange={handleStepClick} />
           <Box sx={{ my: 2 }}>
           {step == 1&&<HotelTypeSelect typeHotel={typeHotel} onSelect={handleSelectType} />}
           {step == 2&&  <HotelBasicInfo/>}
            </Box>
            <Box my={5} display={"flex"} justifyContent={"space-between"}>
                <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }} color='#FF3030'><LoginIcon color='#FF3030' /> Đăng xuất</Typography>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={()=>setStep(step+1)}
                    sx={{

                        background: "#8BC34A",
                        color: "white",
                        py: 1.4,
                        fontSize: 16,
                        fontWeight: 600,
                        borderRadius: 3,
                        width: "150px",
                        textTransform: "none",
                        "&:hover": {
                            background: "#7CB342",
                        },
                    }}
                >
                    Kế tiếp
                </Button>
            </Box>
        </Container>
    )
}

export default CreateHotelView





import { Box, useMediaQuery } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import HotelTypeSelect from './HotelTypeSelect';
import HotelBasicInfo from './HotelBasicInfo';

const steps = [
    { id: 1, label: "Hình thức hợp tác" },
    { id: 2, label: "Thông tin cơ bản" },
    { id: 3, label: "Hình ảnh khách sạn" },
    { id: 4, label: "Vị trí khách sạn" },
    { id: 5, label: "Thêm loại phòng" },
];

function StepIndicator({ activeStep = 1, onStepChange }) {
    const isMobile = useMediaQuery("(max-width:768px)");

    const handleClick = (stepId) => {
        if (onStepChange) onStepChange(stepId);
    };

    return (
        <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems="center"
            justifyContent="start"
            gap={isMobile ? 2 : 4}
            width="100%"
            py={3}
        >
            {steps.map((step, index) => {
                const isCompleted = step.id < activeStep;
                const isActive = step.id === activeStep;

                return (
                    <Box
                        key={step.id}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleClick(step.id)}
                    >
                        {/* Icon số hoặc check */}
                        <Box
                            width={32}
                            height={32}
                            borderRadius="50%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                backgroundColor: isActive ? "#9AC33C" : isCompleted ? "#9AC33C" : "transparent",
                                color: isActive ? "white" : "#666",
                                fontWeight: 600,
                                fontSize: 14,
                                border: isActive ? "1px solid transparent" : isCompleted ? "1px solid transparent" : "1px solid #888"

                            }}
                        >
                            {isCompleted ? (
                                <CheckIcon sx={{ fontSize: 20, color: "white" }} />
                            ) : (
                                step.id
                            )}
                        </Box>

                        {/* Text label */}
                        <Typography
                            fontSize={14}
                            fontWeight={isActive ? 600 : 400}
                            color={isActive ? "#9AC33C" : "#888"}
                        >
                            {step.label}
                        </Typography>

                        {/* Dấu gạch nối (desktop only) */}
                        {index < steps.length - 1 && !isMobile && (
                            <Box

                                sx={{
                                    width: 40,
                                    height: 1,
                                    mt: .5,
                                    borderBottom: "2px dashed #ccc",
                                }}
                            />
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}
