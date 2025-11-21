import { useState } from "react";
import Modal from "./Modal";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleChange = () => {
    // هنا هتبعت البيانات للـ API
    console.log({ oldPass, newPass, confirmPass });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-2xl font-bold mb-6 text-center">Change Password</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Old Password</label>
          <input
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">New Password</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Confirm Password</label>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <button
          onClick={handleChange}
          className="mt-4 bg-primary text-white py-3 rounded-lg w-full font-semibold"
        >
          Change
        </button>
      </div>
    </Modal>
  );
}
