import React, { useState, useEffect } from "react";
import { useBenefitStore } from "../../../store/benefitStore";
import { useAuthStore } from "../../../store/authStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeductionsManagement = () => {
  const {
    deductions,
    error,
    fetchBenefit,
    benefit: benefits,
    fetchBenefitDeductions,
    history,
    fetchMyRequestBenefits,
    myRequestBenefits,
    fetchBenefitDeductionHistory,
    addBenefitDeduction,
  } = useBenefitStore();

  const { fetchUsers, users } = useAuthStore();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState(null); 
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [benefitsName, setBenefitsName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchBenefit();
    fetchMyRequestBenefits();
    fetchBenefitDeductions();
    fetchBenefitDeductionHistory();
    fetchUsers().then(() => {
      if (users) {
        setEmployees(users); 
      }
    });
  }, [fetchBenefit, fetchBenefitDeductions,fetchMyRequestBenefits, fetchBenefitDeductionHistory, fetchUsers, users]);

  const handleAddDeduction = async (e) => {
    e.preventDefault();
  
    const amountAsNumber = Number(amount);
    if (!selectedEmployee || !selectedBenefit || !amount || amountAsNumber <= 0 || isNaN(amountAsNumber)) {
        toast.error("Please fill in all fields correctly.");
        return;
    }
  
    const selectedEmployeeDetails = employees.find(employee => employee._id === selectedEmployee);
    console.log("Selected Benefit ID:", selectedBenefit);
    console.log("My Request Benefits:", myRequestBenefits);
  
    const selectedBenefitDetails = myRequestBenefits.find(
        (benefit) => benefit.benefitsName?._id === selectedBenefit
    );
    
    console.log("Selected Benefit Details:", selectedBenefitDetails);
  
    if (!selectedBenefitDetails) {
        toast.error("The employee did not request this benefit.");
        return;
    }

    if (selectedBenefitDetails.status !== "Approved") {
        toast.error("The request is not approved yet.");
        return;
    }

    const deductionData = {
        employeeId: selectedEmployee,
        benefitsName: selectedBenefitDetails.benefitsName._id,
        amount: amountAsNumber,
    };
  
    try {
        const response = await addBenefitDeduction(deductionData);
        console.log(response);
        if (response && response.success) {
            toast.success("Benefit Deduction added successfully!");
            fetchBenefitDeductions();
            fetchBenefitDeductionHistory();
            setSelectedEmployee("");
            setSelectedBenefit("");
            setAmount("");
        } else {
            toast.error(response?.message || "Failed to add deduction.");
        }
    } catch (error) {
        console.error("Error in handleAddDeduction:", error); 
        toast.error(error?.response?.data?.message || "An error occurred while adding the deduction.");
    }
};

    const groupedDeductions = deductions.reduce((acc, deduction) => {
    const employeeKey = `${deduction.employeeId._id}_${deduction.benefitsName._id}`;
    if (!acc[employeeKey]) {
      acc[employeeKey] = {
        employeeName: `${deduction.employeeId.firstName} ${deduction.employeeId.lastName}`,
        benefitsName: deduction.benefitsName.benefitsName,
        totalAmount: 0,
        employeeId: deduction.employeeId._id,
      };
    }
    acc[employeeKey].totalAmount += deduction.amount;
    return acc;
  }, {});

  const groupedArray = Object.values(groupedDeductions);
  let renderedEmployees = {};

  const filteredHistory = selectedHistory
    ? history.filter(
        (item) => item.benefitsName.benefitsName === selectedHistory
      )
    : [];

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">Benefit Deductions</h3>
      
      <form onSubmit={handleAddDeduction} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Employee</option>
            {employees.length > 0 &&
              employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Select Benefit</label>
          <select
  value={selectedBenefit}
  onChange={(e) => setSelectedBenefit(e.target.value)} 
  className="w-full p-2 border border-gray-300 rounded"
>
  <option value="">Select Benefit</option>
  {myRequestBenefits && myRequestBenefits.length > 0 ? (
    benefits.map((benefit) => (
      <option key={benefit._id} value={benefit._id}>
        {benefit.benefitsName}
      </option>
    ))
  ) : (
    <option value="">No benefits available</option>
  )}
</select>

        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Amount"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Deduction
        </button>
      </form>

      {groupedArray.length === 0 ? (
        <p>No deductions available.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border-b text-left">Employee Name</th>
              <th className="px-4 py-2 border-b text-left">Benefit Name</th>
              <th className="px-4 py-2 border-b text-left">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {groupedArray.map((deduction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  {renderedEmployees[deduction.employeeId]
                    ? ""
                    : deduction.employeeName}
                  {(renderedEmployees[deduction.employeeId] = true)}
                </td>
                <td
                  className="px-4 py-2 border-b text-blue-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHistory(deduction.benefitsName);
                  }}
                >
                  {deduction.benefitsName}
                </td>
                <td className="px-4 py-2 border-b">{deduction.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedHistory && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Benefit Deduction History for {selectedHistory}
            </h3>
            {filteredHistory.length === 0 ? (
              <p>No history available for this benefit.</p>
            ) : (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-4 py-2 border-b text-left">Employee Name</th>
                    <th className="px-4 py-2 border-b text-left">Amount</th>
                    <th className="px-4 py-2 border-b text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((historyItem, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">
                        {historyItem.employeeId.firstName} {historyItem.employeeId.lastName}
                      </td>
                      <td className="px-4 py-2 border-b">{historyItem.amount}</td>
                      <td className="px-4 py-2 border-b">
                        {new Date(historyItem.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded"
              onClick={() => setSelectedHistory(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DeductionsManagement;
