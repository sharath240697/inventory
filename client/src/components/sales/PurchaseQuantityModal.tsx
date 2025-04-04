import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { usePurchaseTable } from "../../context/PurchaseTableContext";

export default function PurchaseQuantityModal() {

    const { scannedValue, setScannedValue,
        isOpen, onClose,
        selectedItemIndex,
        inputValue, setInputValue,
        isValid, setIsValid,
    } = usePurchaseTable();

    const handlePopupSubmit = () => {
        if (selectedItemIndex !== null && scannedValue[selectedItemIndex]) {
            const item = scannedValue[selectedItemIndex];
            const min = item.minQuantity || (item.allowLoose ? 0.1 : 1);
            const newQuantity = parseFloat(inputValue);

            if (!isNaN(newQuantity)) {
                if (item.allowLoose) {
                    if (newQuantity >= min) {
                        setScannedValue(prevState => {
                            return [
                                ...prevState.slice(0, selectedItemIndex),
                                {
                                    ...item,
                                    quantity: parseFloat(newQuantity.toFixed(3)),
                                    price: Math.ceil(newQuantity * (item.unitPrice || 0))
                                },
                                ...prevState.slice(selectedItemIndex + 1)
                            ];
                        });
                        setInputValue("");
                        onClose();
                    } else {
                        alert(`Please enter a valid quantity greater than or equal to ${min}`);
                    }
                } else {
                    if (newQuantity >= min && Math.floor(newQuantity) === newQuantity) {
                        setScannedValue(prevState => {
                            return [
                                ...prevState.slice(0, selectedItemIndex),
                                {
                                    ...item,
                                    quantity: newQuantity,
                                    price: Math.ceil(newQuantity * (item.unitPrice || 0))
                                },
                                ...prevState.slice(selectedItemIndex + 1)
                            ];
                        });
                        setInputValue("");
                        onClose();
                    } else {
                        alert(`Please enter a valid whole number quantity greater than or equal to ${min}`);
                    }
                }
            } else {
                alert("Please enter a valid number");
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Enter Quantity</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            setInputValue(value);

                            if (selectedItemIndex !== null && scannedValue[selectedItemIndex]) {
                                const item = scannedValue[selectedItemIndex];
                                const min = item.minQuantity || (item.allowLoose ? 0.1 : 1);

                                // Regex patterns for validation
                                const decimalPattern = /^\d*\.?\d+$/; // Matches decimal numbers like 0.5, 1.25
                                const wholeNumberPattern = /^\d+$/; // Matches whole numbers only

                                // Check with appropriate regex based on item type
                                const regexValid = item.allowLoose
                                    ? decimalPattern.test(value)
                                    : wholeNumberPattern.test(value);

                                // If regex passes, then parse and validate the value
                                if (regexValid) {
                                    const parsed = parseFloat(value);
                                    setIsValid(
                                        item.allowLoose
                                            ? parsed >= min
                                            : parsed >= min && Math.floor(parsed) === parsed
                                    );
                                } else {
                                    setIsValid(false);
                                }
                            } else {
                                setIsValid(false);
                            }
                        }}
                        size="lg"
                        placeholder={selectedItemIndex !== null && scannedValue[selectedItemIndex]
                            ? scannedValue[selectedItemIndex].allowLoose
                                ? "Enter decimal value (e.g., 0.5, 1.25)"
                                : "Enter whole number"
                            : "Select an item first"}
                        isInvalid={!isValid}
                    />
                    {!isValid && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                            {selectedItemIndex !== null && scannedValue[selectedItemIndex]
                                ? scannedValue[selectedItemIndex].allowLoose
                                    ? `Please enter a valid decimal quantity greater than or equal to ${scannedValue[selectedItemIndex].minQuantity || 0.1}`
                                    : `Please enter a valid whole number quantity greater than or equal to ${scannedValue[selectedItemIndex].minQuantity || 1}`
                                : "Please select an item first"}
                        </Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onClose}>Cancel</Button>
                    <Button
                        colorScheme="blue"
                        onClick={handlePopupSubmit}
                        isDisabled={!isValid || inputValue.trim() === ""}
                    >
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}