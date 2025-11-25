import { useState } from "react";
import { apiService } from "../services/api";

const Retrait = () => {
  const [formData, setFormData] = useState({
    transactionType: "WITHDRAWAL",
    amount: "",
    accountNumber: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Met à jour les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumet le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation simple
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setError("Veuillez saisir un montant valide.");
      return;
    }
    if (!formData.accountNumber) {
      setError("Veuillez saisir le numéro du compte.");
      return;
    }

    setLoading(true);

    try {
      // Création des données à envoyer
      const data = {
        transactionType: formData.transactionType,
        amount: Number(formData.amount),
        accountNumber: formData.accountNumber,
        description: formData.description,
      };

      // Appel API pour le retrait
      const response = await apiService.makeWithdrawal(data);

      if (response.data && response.data.statusCode === 200) {
        setSuccessMessage("Retrait effectué avec succès !");
        // Réinitialisation du formulaire
        setFormData({
          transactionType: "WITHDRAWAL",
          amount: "",
          accountNumber: "",
          description: "",
        });
      } else {
        setError(response.data?.message || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="retrait-container">
      <h2>Effectuer un Retrait</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="retrait-form">
        <div className="form-group">
          <label>Numéro du compte</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Ex: 6623144539"
            required
          />
        </div>

        <div className="form-group">
          <label>Montant</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Ex: 5000"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Argent pour transport"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "En cours..." : "Effectuer le retrait"}
        </button>
      </form>
    </div>
  );
};

export default Retrait;
