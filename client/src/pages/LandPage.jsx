import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { MapPin, Plus, Trash2, Sprout, CheckCircle2, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import SoilRadarChart from '../components/common/SoilRadarChart.jsx';

export default function LandPage() {
  const { profile } = useAuth();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const [newLand, setNewLand] = useState({
    landName: '',
    area: 2.5,
    areaUnit: 'acre',
    state: profile?.state || 'Karnataka',
    district: profile?.district || 'Dharwad',
    village: '',
    soilType: 'Black Soil',
    soilPh: 7.2,
    nitrogen: 180,
    phosphorus: 35,
    potassium: 220,
    soilMoisture: 30,
    irrigationAvailable: true,
    previousCrop: ''
  });

  const loadLands = async () => {
    try {
      setLoading(true);
      const res = await api.getLands();
      setLands(res.data || []);
    } catch (err) {
      console.warn('Failed to load lands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLand(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
        ? (value === '' ? null : Number(value)) 
        : value
    }));
  };

  const handleCreateLand = async (e) => {
    e.preventDefault();
    try {
      setActionError('');
      await api.createLand(newLand);
      setActionSuccess('New land parcel added successfully!');
      setShowAddModal(false);
      loadLands();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setActionError(err.message || 'Failed to add land parcel');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this land record?')) return;
    try {
      await api.deleteLand(id);
      loadLands();
    } catch (err) {
      alert(err.message || 'Could not delete land record');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-forest-600" />
              <span>Agricultural Land & Soil Ledger</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Register individual field plots with chemical soil tests and irrigation profiles.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Farm Plot</span>
          </button>
        </div>

        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner size="lg" text="Loading farm parcels..." />
        ) : lands.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 p-8 space-y-4">
            <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-2xl flex items-center justify-center mx-auto">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Farm Plots Registered</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Register your agricultural parcels with soil test metrics (pH, NPK) to unlock hyper-accurate AI crop recommendations.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-600 text-white font-bold text-sm shadow-sm hover:bg-forest-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Land Parcel</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lands.map((land) => (
              <div
                key={land.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{land.land_name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {land.district}, {land.state} {land.village ? `• Village: ${land.village}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(land.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete Parcel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-gray-50 rounded-xl text-center text-xs">
                    <div>
                      <span className="text-gray-400 block uppercase font-semibold text-[10px]">Area</span>
                      <span className="font-bold text-gray-800 text-sm">
                        {land.area} {land.area_unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-semibold text-[10px]">Soil Type</span>
                      <span className="font-bold text-gray-800 text-sm truncate block">
                        {land.soil_type || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-semibold text-[10px]">Irrigation</span>
                      <span className="font-bold text-gray-800 text-sm">
                        {land.irrigation_available ? 'Available' : 'Rainfed'}
                      </span>
                    </div>
                  </div>

                  {/* Soil Radar Chart */}
                  <SoilRadarChart
                    nitrogen={land.nitrogen}
                    phosphorus={land.phosphorus}
                    potassium={land.potassium}
                    ph={land.soil_ph}
                  />

                  {/* Metric Chips */}
                  <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                    <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-gray-500 block font-semibold">pH</span>
                      <span className="font-bold text-emerald-800 text-xs">
                        {land.soil_ph !== null && land.soil_ph !== undefined ? land.soil_ph : 'N/A'}
                      </span>
                    </div>
                    <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                      <span className="text-[10px] text-gray-500 block font-semibold">N (kg/ha)</span>
                      <span className="font-bold text-blue-800 text-xs">{land.nitrogen ?? 'N/A'}</span>
                    </div>
                    <div className="bg-purple-50/70 p-2 rounded-lg border border-purple-100">
                      <span className="text-[10px] text-gray-500 block font-semibold">P (kg/ha)</span>
                      <span className="font-bold text-purple-800 text-xs">{land.phosphorus ?? 'N/A'}</span>
                    </div>
                    <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-100">
                      <span className="text-[10px] text-gray-500 block font-semibold">K (kg/ha)</span>
                      <span className="font-bold text-amber-800 text-xs">{land.potassium ?? 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add Land Parcel */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Register Farm Parcel</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <form onSubmit={handleCreateLand} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Land / Parcel Name *
                  </label>
                  <input
                    type="text"
                    name="landName"
                    value={newLand.landName}
                    onChange={handleInputChange}
                    placeholder="e.g. North Plot - Near Canal"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest-500 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Cultivable Area *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={newLand.area}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0.1"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Measurement Unit
                    </label>
                    <select
                      name="areaUnit"
                      value={newLand.areaUnit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                    >
                      <option value="acre">Acre</option>
                      <option value="hectare">Hectare</option>
                      <option value="guntha">Guntha</option>
                      <option value="bigha">Bigha</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Soil Type
                    </label>
                    <select
                      name="soilType"
                      value={newLand.soilType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                    >
                      <option value="Black Soil">Black Cotton Soil (Vertisol)</option>
                      <option value="Red Soil">Red Soil</option>
                      <option value="Alluvial Soil">Alluvial Soil</option>
                      <option value="Loamy Soil">Loamy Soil</option>
                      <option value="Clay Soil">Clay Soil</option>
                      <option value="Laterite Soil">Laterite Soil</option>
                      <option value="Sandy Soil">Sandy Soil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Soil pH (0 - 14)
                    </label>
                    <input
                      type="number"
                      name="soilPh"
                      value={newLand.soilPh ?? ''}
                      onChange={handleInputChange}
                      step="0.1"
                      min="3"
                      max="11"
                      placeholder="e.g. 7.2"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      N (kg/ha)
                    </label>
                    <input
                      type="number"
                      name="nitrogen"
                      value={newLand.nitrogen ?? ''}
                      onChange={handleInputChange}
                      placeholder="180"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      P (kg/ha)
                    </label>
                    <input
                      type="number"
                      name="phosphorus"
                      value={newLand.phosphorus ?? ''}
                      onChange={handleInputChange}
                      placeholder="35"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      K (kg/ha)
                    </label>
                    <input
                      type="number"
                      name="potassium"
                      value={newLand.potassium ?? ''}
                      onChange={handleInputChange}
                      placeholder="220"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="irrigationAvailable"
                    name="irrigationAvailable"
                    checked={newLand.irrigationAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-forest-600 rounded focus:ring-forest-500"
                  />
                  <label htmlFor="irrigationAvailable" className="text-xs font-semibold text-gray-700">
                    Irrigation facility available (Borewell / Canal / Drip)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-forest-600 text-white hover:bg-forest-700 shadow-sm"
                  >
                    Save Farm Parcel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
