import { Button } from "@/components/ui/button";
import { ApartmentMatrix } from "@/pages/Blocks/create-block/ApartmentMatrix";
import type { Apartment, ApartmentType } from "@/pages/Blocks/create-block/ApartmentMatrix";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { handleStepTwo } from "@/store/slices/actionBlockSlice";
import { useState, useCallback } from "react";
interface StepOneProps {
  setStep: (step: number) => void;
}
const StepTwo = ({ setStep }: StepOneProps) => {
  const value = useAppSelector((state) => state.actionBlock);
  const dispatch = useAppDispatch();
  const [apartments, setApartments] = useState<Apartment[]>([]);

  const handleApartmentsChange = useCallback((newApartments: Apartment[]) => {
    setApartments(newApartments);
  }, []);
  const handleContinue = () => {
    const data: {
      roomName: string;
      type: string;
      area: number;
      floor: number;
    }[] = apartments.map((apt) => ({
      roomName: apt.code,
      type: apt.type,
      area: apt.area,
      floor: apt.floor,
    }));
    dispatch(handleStepTwo({ apartments: data }));
    setStep(3);
  };
  const handlePrevious = () => {
    setStep(1);
  };
  return (
    <div>
      <ApartmentMatrix
        apartmentsPerFloor={value.apartmentsPerFloor}
        areasPerApartment={value.areasPerApartment}
        totalFloors={value.totalFloors}
        typesOfApartment={value.typesOfApartment as ApartmentType}
        onApartmentsChange={handleApartmentsChange}
      />
      <div className="flex items-center justify-end gap-[10px] mt-4">
        <Button variant="outline" onClick={handlePrevious}>
          Trước đó
        </Button>
        <Button onClick={handleContinue}>Tiếp theo</Button>
      </div>
    </div>
  );
};
export default StepTwo;
