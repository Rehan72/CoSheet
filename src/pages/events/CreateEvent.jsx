import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Button
} from "../../components/ui/button";
import {
  Input
} from "../../components/ui/input";
import {
  Textarea
} from "../../components/ui/textarea";
import {
  Label,
} from "../../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { DatePicker } from "../../components/ui/date-picker";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Tag,
  FileText,
  ArrowLeft,
  Save,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { ImageIcon } from "lucide-react";
import { FilePlus } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Eye } from "lucide-react";
import { SaveAll } from "lucide-react";



const DRAFT_KEY = "create_event_draft_v1";

export default function CreateEventGlass() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null,
    startTime: "",
    endTime: "",
    location: "",
    eventType: "",
    maxCapacity: "",
    price: "",
    status: "upcoming",
    organizerName: "",
    organizerPhone: "",
    organizerEmail: "",
    banner: null, // dataURL for preview
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const eventTypes = [
    "Workshop","Meeting","Product Launch","Training Session","Conference",
    "Seminar","Webinar","Networking","Celebration","Party","Competition","Presentation"
  ];

  const statuses = ["upcoming","ongoing","draft"];

  // load draft if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setFormData((prev) => ({ ...prev, ...parsed }));
        showToast("Draft loaded");
      }
    } catch (err) {
      console.warn("Failed to load draft", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg, ms = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Event title is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Choose a date";
    if (!formData.startTime) newErrors.startTime = "Start time required";
    if (!formData.endTime) newErrors.endTime = "End time required";
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime)
      newErrors.endTime = "End time must be after start time";
    if (!formData.location?.trim()) newErrors.location = "Location required";
    if (!formData.eventType) newErrors.eventType = "Select event type";
    if (!formData.organizerName?.trim()) newErrors.organizerName = "Organizer name required";
    if (!formData.organizerPhone?.trim()) newErrors.organizerPhone = "Organizer phone required";
    if (!formData.organizerEmail?.trim()) newErrors.organizerEmail = "Organizer email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizerEmail))
      newErrors.organizerEmail = "Enter a valid email";

    if (formData.maxCapacity && (isNaN(formData.maxCapacity) || +formData.maxCapacity < 1))
      newErrors.maxCapacity = "Positive number required";

    if (formData.price && (isNaN(formData.price) || +formData.price < 0))
      newErrors.price = "Non-negative number required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBanner = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      handleInputChange("banner", e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const saveDraft = () => {
    try {
      const toSave = { ...formData };
      // don't store heavy things or derived props if needed; banner included here
      localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      showToast("Draft saved");
    } catch (err) {
      console.error(err);
      showToast("Failed to save draft");
    }
  };

  const clearDraftAndReset = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData({
      title: "", description: "", date: null, startTime: "", endTime: "",
      location: "", eventType: "", maxCapacity: "", price: "", status: "upcoming",
      organizerName: "", organizerPhone: "", organizerEmail: "", banner: null
    });
    setErrors({});
    showToast("Form reset");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Fix errors before submitting");
      return;
    }
    setSaving(true);
    // simulate API request
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);

    // remove draft on success
    localStorage.removeItem(DRAFT_KEY);
    showToast("Event created successfully");
    // navigate back or do further actions
    navigate("/event");
  };

  // animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    hover: { scale: 1.01, transition: { duration: 0.25 } },
  };

  const btnTap = { scale: 0.98 };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#0f172a] to-[#071029]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate("/event")} className="text-slate-200/80">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div>
            <h2 className="text-3xl font-semibold text-white flex items-center gap-3">
              <Calendar className="h-7 w-7 text-white/90" />
              Create Event (Glass)
            </h2>
            <p className="text-sm text-slate-300/70">A glass-morphism form with helpful utilities & animations</p>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed right-6 top-6 bg-white/10 text-white px-4 py-2 rounded-lg backdrop-blur border border-white/10 shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="enter"
            whileHover="hover"
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-xl"
          >
            {/* Basic */}
            <SectionHeader icon={<FileText />} title="Basic Info" subtitle="Essential event details" />
            <div className="space-y-4 mt-3">
              <Label className="text-sm text-slate-200">Event Title *</Label>
              <Input
                placeholder="The big product launch"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-red-400" : ""}
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}

              <Label className="text-sm text-slate-200">Description *</Label>
              <Textarea
                rows={4}
                placeholder="Write a short description..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
              {errors.description && <p className="text-xs text-red-400">{errors.description}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-slate-200">Event Type *</Label>
                  <Select value={formData.eventType} onValueChange={(v) => handleInputChange("eventType", v)}>
                    <SelectTrigger className={`w-full ${errors.eventType ? "ring-2 ring-red-400" : ""}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.eventType && <p className="text-xs text-red-400">{errors.eventType}</p>}
                </div>

                <div>
                  <Label className="text-sm text-slate-200">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Banner */}
              <div className="pt-2">
                <Label className="text-sm text-slate-200 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Event Banner
                </Label>

                <div className="flex gap-3 items-center mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleBanner(e.target.files?.[0])}
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                    <FilePlus className="h-4 w-4" /> Upload banner
                  </Button>

                  {formData.banner ? (
                    <div className="w-28 h-16 rounded-md overflow-hidden border border-white/10 shadow-sm">
                      <img src={formData.banner} alt="banner preview" className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="text-sm text-slate-300">No banner</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="enter"
            whileHover="hover"
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-xl"
          >
            {/* Date / Organizer / Location / Capacity */}
            <SectionHeader icon={<Clock />} title="Date & Organizer" subtitle="When and who" />
            <div className="mt-3 space-y-4">
              <Label className="text-sm text-slate-200">Event Date *</Label>
              <DatePicker value={formData.date} onChange={(d) => handleInputChange("date", d)} />
              {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-slate-200">Start Time *</Label>
                  <Input type="time" value={formData.startTime} onChange={(e) => handleInputChange("startTime", e.target.value)} />
                  {errors.startTime && <p className="text-xs text-red-400">{errors.startTime}</p>}
                </div>
                <div>
                  <Label className="text-sm text-slate-200">End Time *</Label>
                  <Input type="time" value={formData.endTime} onChange={(e) => handleInputChange("endTime", e.target.value)} />
                  {errors.endTime && <p className="text-xs text-red-400">{errors.endTime}</p>}
                </div>
              </div>

              <Label className="text-sm text-slate-200">Organizer Name *</Label>
              <Input placeholder="Jane Doe" value={formData.organizerName} onChange={(e) => handleInputChange("organizerName", e.target.value)} />
              {errors.organizerName && <p className="text-xs text-red-400">{errors.organizerName}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-slate-200">Phone *</Label>
                  <Input placeholder="+1 555 555 5555" value={formData.organizerPhone} onChange={(e) => handleInputChange("organizerPhone", e.target.value)} />
                  {errors.organizerPhone && <p className="text-xs text-red-400">{errors.organizerPhone}</p>}
                </div>

                <div>
                  <Label className="text-sm text-slate-200">Email *</Label>
                  <Input placeholder="organizer@you.com" value={formData.organizerEmail} onChange={(e) => handleInputChange("organizerEmail", e.target.value)} />
                  {errors.organizerEmail && <p className="text-xs text-red-400">{errors.organizerEmail}</p>}
                </div>
              </div>

              <Label className="text-sm text-slate-200">Location *</Label>
              <Input placeholder="Venue or address" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} />
              {errors.location && <p className="text-xs text-red-400">{errors.location}</p>}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-slate-200">Max Capacity</Label>
                  <Input type="number" placeholder="e.g. 150" value={formData.maxCapacity} onChange={(e) => handleInputChange("maxCapacity", e.target.value)} />
                  {errors.maxCapacity && <p className="text-xs text-red-400">{errors.maxCapacity}</p>}
                </div>
                <div>
                  <Label className="text-sm text-slate-200">Ticket Price</Label>
                  <Input type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} />
                  {errors.price && <p className="text-xs text-red-400">{errors.price}</p>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Full width action card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="enter"
            whileHover="hover"
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-xl flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white font-semibold flex items-center gap-3">
                  <Tag className="h-5 w-5" /> Finalize
                </h3>
                <p className="text-sm text-slate-300">Preview or save draft before publishing</p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button whileTap={btnTap} onClick={() => { saveDraft(); }} className="px-3 py-2 rounded-md bg-white/8 hover:bg-white/12 text-white/90 border border-white/6 flex items-center gap-2">
                  <FilePlus className="h-4 w-4" /> Save Draft
                </motion.button>

                <motion.button whileTap={btnTap} onClick={() => { clearDraftAndReset(); }} className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/12 text-white/90 border border-white/6 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" /> Reset
                </motion.button>

                <motion.button whileTap={btnTap} onClick={() => setPreviewOpen(true)} className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/16 text-white/100 border border-white/6 flex items-center gap-2">
                  <Eye className="h-4 w-4" /> Preview
                </motion.button>

                <motion.button whileTap={btnTap} type="submit" onClick={handleSubmit} className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium flex items-center gap-2">
                  <SaveAll className="h-4 w-4" /> {saving ? "Saving..." : "Create Event"}
                </motion.button>
              </div>
            </div>

            <div className="text-sm text-slate-300">
              Tip: use <strong>Save Draft</strong> to keep progress. Banner images are only previewed locally.
            </div>

            <CardFooter className="pt-2 flex justify-between items-center">
              <div className="text-xs text-slate-400">Auto-saves to browser when you press Save Draft.</div>
              <div className="text-xs text-slate-400">You can also reset the form to clear everything.</div>
            </CardFooter>
          </motion.div>
        </form>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <PreviewModal data={formData} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
}

/* ---------- Small components ---------- */

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-md bg-white/6 text-white/90">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-semibold">{title}</h4>
        {subtitle && <div className="text-xs text-slate-300">{subtitle}</div>}
      </div>
    </div>
  );
}

/* Preview modal component */
function PreviewModal({ data, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ backdropFilter: "blur(6px)" }}
      >
        <div className="relative bg-gradient-to-b from-white/8 to-white/4 border border-white/10">
          {data.banner ? (
            <div className="h-44 w-full overflow-hidden">
              <img src={data.banner} alt="banner" className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="h-32 w-full flex items-center justify-center bg-white/3 text-white/80">
              No banner
            </div>
          )}

          <div className="p-6 bg-gradient-to-b from-white/6 to-white/5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">{data.title || "Untitled Event"}</h3>
                <p className="text-sm text-slate-300 mt-1">{data.eventType || "—"} • {data.status}</p>
                <p className="text-sm text-slate-300 mt-3">{data.description || "No description provided."}</p>
              </div>

              <div className="text-right">
                <div className="text-sm text-slate-300">{data.date ? new Date(data.date).toLocaleDateString() : "—"}</div>
                <div className="text-sm text-slate-200 mt-2">{data.startTime} — {data.endTime}</div>
                <div className="text-sm text-slate-300 mt-3">{data.location || "No location"}</div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-300">
                Organizer: <strong className="text-white">{data.organizerName || "—"}</strong><br />
                <span className="text-xs">{data.organizerEmail || ""} • {data.organizerPhone || ""}</span>
              </div>

              <div className="text-sm text-slate-300">
                Capacity: <strong className="text-white">{data.maxCapacity || "—"}</strong><br />
                Price: <strong className="text-white">{data.price ? `₹${data.price}` : "Free"}</strong>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>Close</Button>
              <Button onClick={() => { onClose(); alert("Pretend we published this!"); }}>Publish</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}