'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Briefcase,
  X,
  DollarSign,
  Clock
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const defaultService = {
  name: '',
  description: '',
  price: '',
  duration: '',
  category: '',
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState(defaultService);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.log('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedService(null);
    setFormData(defaultService);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: (service.price / 100).toString(),
      duration: service.duration.toString(),
      category: service.category || '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openDeleteDialog = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.duration || parseInt(formData.duration) < 15) {
      newErrors.duration = 'Duration must be at least 15 minutes';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100),
        duration: parseInt(formData.duration),
        category: formData.category || 'General',
      };

      const url = selectedService
        ? `/api/services/${selectedService._id}`
        : '/api/services';
      const method = selectedService ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchServices();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log('Error saving service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const res = await fetch(`/api/services/${selectedService._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== selectedService._id));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.log('Error deleting service');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <main className="lg:ml-64 p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1F2937]">Services</h1>
              <p className="text-[#6B7280] mt-1">
                Manage your service catalog.
              </p>
            </div>
            <Button
              onClick={openCreateModal}
              className="bg-[#2563EB] hover:bg-[#1E3A5F] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#2563EB] mx-auto" />
              <p className="mt-2 text-[#6B7280]">Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {services.map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-[#DBEAFE] text-[#2563EB]">
                        {service.category || 'General'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(service)}
                        >
                          <Pencil className="h-4 w-4 text-[#6B7280]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(service)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-[#E2E8F0]">
                      <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-[#1E3A5F]">
                        <DollarSign className="h-4 w-4" />
                        <span>{(service.price / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
              <Briefcase className="h-12 w-12 text-[#6B7280] mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-[#1F2937]">No services yet</p>
              <p className="text-sm text-[#6B7280] mt-1 mb-4">
                Add your first service to get started.
              </p>
              <Button
                onClick={openCreateModal}
                className="bg-[#2563EB] hover:bg-[#1E3A5F] text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              {selectedService
                ? 'Update the service details below.'
                : 'Fill in the details for your new service.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Deep Tissue Massage"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service..."
                rows={3}
                className="mt-1"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="99.00"
                  className="mt-1"
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="60"
                  className="mt-1"
                />
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Wellness, Consulting"
                className="mt-1"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#2563EB] hover:bg-[#1E3A5F] text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : selectedService ? (
                  'Update Service'
                ) : (
                  'Create Service'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedService?.name}&rdquo;? 
              This action cannot be undone. Existing bookings will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
