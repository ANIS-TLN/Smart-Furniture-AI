import React, { useEffect, useState } from "react";
import { getProduitsAValider, getCommandeenattente, getTotalUtilisateurs } from "../../api";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend, ResponsiveContainer
} from 'recharts';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import "../pagescss/Dashboard.css";
import Sidebar from '../../components/componentjs/Sidebar';

const Dashboard = () => {
  const [stats, setStats] = useState({
    produitsAValider: 0,
    commandesEnAttente: 0,
    totalUtilisateurs: 0,
    totalProduits: 0,
    totalCommandes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const produitsData = await getProduitsAValider();
        const commandesData = await getCommandeenattente();
        const utilisateursData = await getTotalUtilisateurs();

        setStats({
          produitsAValider: produitsData.produitsAValider,
          commandesEnAttente: commandesData.commandesEnAttente,
          totalUtilisateurs: utilisateursData.totalUtilisateurs,
          totalProduits: produitsData.totalProduits,
          totalCommandes: commandesData.totalCommandes,
        });
      } catch (err) {
        console.error("Erreur de récupération des statistiques :", err);
      }
    };
    fetchStats();
  }, []);

  const dataProduits = [
    { name: 'Produits à valider', value: stats.produitsAValider, fill: '#e74c3c' }, // Rouge
    { name: 'Autres Produits', value: stats.totalProduits - stats.produitsAValider, fill: '#f1c40f' } // Jaune
  ];

  const dataCommandes = [
    { name: 'Commandes en attente', value: stats.commandesEnAttente, fill: '#3498db' }, // Bleu
    { name: 'Autres Commandes', value: stats.totalCommandes - stats.commandesEnAttente, fill: '#f1c40f' } // Jaune
  ];

  const dataBar = [
    { name: 'Produits à valider', value: stats.produitsAValider },
    { name: 'Commandes en attente', value: stats.commandesEnAttente },
    { name: 'Utilisateurs', value: stats.totalUtilisateurs }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Tableau de bord</h1>

        <div className="stats">
          <div className="card">
            <h3>🛒 Produits à valider</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dataProduits} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                  {dataProduits.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <PieTooltip />
                <PieLegend />
              </PieChart>
            </ResponsiveContainer>
            <p>{stats.produitsAValider} produits à valider</p>
          </div>

          <div className="card">
            <h3>📦 Commandes en attente</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dataCommandes} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                  {dataCommandes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <PieTooltip />
                <PieLegend />
              </PieChart>
            </ResponsiveContainer>
            <p>{stats.commandesEnAttente} commandes en attente</p>
          </div>

          <div className="card">
            <h3>👤 Utilisateurs</h3>
            <div className="utilisateur-box">
              <span className="icon">👥</span>
              <span className="count">{stats.totalUtilisateurs}</span>
              <span className="label">personnes</span>
            </div>
          </div>
        </div>

        <div className="bar-chart-container">
          <h3>Statistiques Globales</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="url(#colorBar)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e74c3c" /> {/* Rouge */}
                  <stop offset="100%" stopColor="#3498db" /> {/* Bleu */}
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
