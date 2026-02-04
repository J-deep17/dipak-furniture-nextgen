import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X, Upload, Image as ImageIcon } from "lucide-react";

import { api, getFullImageUrl } from "@/lib/api";

const CategoryList = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [newCategoryImagePreview, setNewCategoryImagePreview] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const [newDisplayOrder, setNewDisplayOrder] = useState(0);
    const [newParentId, setNewParentId] = useState<string>("");
    const [editDisplayOrder, setEditDisplayOrder] = useState(0);
    const [editIsActive, setEditIsActive] = useState(true);
    const [editParentId, setEditParentId] = useState<string>("");

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/categories?all=true');
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                setError("Invalid data format received");
            }
        } catch (error) {
            setError("Failed to connect to the server");
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewCategoryImage(file);
            setNewCategoryImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEditImage(file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('token');
        const res = await api.post('/upload', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.path; // Correct property name from backend
    };

    const handleAdd = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const token = localStorage.getItem('token');
            let imageUrl = "";
            if (newCategoryImage) {
                imageUrl = await uploadImage(newCategoryImage);
            }

            await api.post('/categories', {
                name: newCategoryName,
                description: newCategoryDescription,
                image: imageUrl,
                displayOrder: newDisplayOrder,
                parent: newParentId || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Category added");
            setNewCategoryName("");
            setNewCategoryDescription("");
            setNewDisplayOrder(0);
            setNewParentId("");
            setNewCategoryImage(null);
            setNewCategoryImagePreview(null);
            fetchCategories();
        } catch (error) {
            toast.error("Error adding category");
        }
    };

    const handleUpdate = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            let imageUrl = existingImage;

            if (editImage) {
                imageUrl = await uploadImage(editImage);
            }

            await api.put(`/categories/${id}`, {
                name: editName,
                description: editDescription,
                image: imageUrl,
                displayOrder: editDisplayOrder,
                isActive: editIsActive,
                parent: editParentId || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Category updated");
            setIsEditing(null);
            setEditImage(null);
            setEditImagePreview(null);
            setEditName("");
            setEditDescription("");
            setEditParentId("");
            setEditIsActive(true);
            setExistingImage(null);
            fetchCategories();
        } catch (error) {
            console.error("Update category error:", error);
            toast.error("Error updating category");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Category deleted");
            fetchCategories();
        } catch (error) {
            toast.error("Error deleting category");
        }
    };

    const handleRemoveImage = () => {
        if (isEditing) {
            setEditImage(null);
            setEditImagePreview(null);
            setExistingImage(null);
        } else {
            setNewCategoryImage(null);
            setNewCategoryImagePreview(null);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage product categories</p>
                </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-medium">Order</label>
                        <Input
                            type="number"
                            value={newDisplayOrder}
                            onChange={(e) => setNewDisplayOrder(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-medium">Image</label>
                        <div className="flex items-center gap-2">
                            {newCategoryImagePreview ? (
                                <div className="relative h-10 w-10 rounded border overflow-hidden">
                                    <img src={newCategoryImagePreview} alt="Preview" className="h-full w-full object-cover" />
                                    <button onClick={handleRemoveImage} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <Button variant="outline" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="h-4 w-4 mr-2" /> Upload
                                </Button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleNewImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium">Parent Category</label>
                        <select
                            value={newParentId}
                            onChange={(e) => setNewParentId(e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="">None (Top Level)</option>
                            {categories.filter(c => !c.parent).map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            placeholder="Brief description..."
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAdd} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[80px]">Order</TableHead>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        <span>Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-red-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <p>{error}</p>
                                        <Button variant="outline" size="sm" onClick={fetchCategories}>Retry</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (categories.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat._id} className="group">
                                    <TableCell>
                                        {isEditing === cat._id ? (
                                            <Input
                                                type="number"
                                                value={editDisplayOrder}
                                                onChange={(e) => setEditDisplayOrder(parseInt(e.target.value))}
                                                className="w-16 h-9"
                                            />
                                        ) : (
                                            cat.displayOrder || 0
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative h-10 w-10 rounded border overflow-hidden bg-muted group/edit-img">
                                            <img
                                                src={isEditing === cat._id ? (editImagePreview || getFullImageUrl(existingImage || "")) : getFullImageUrl(cat.image)}
                                                alt=""
                                                className="h-full w-full object-cover shadow-sm"
                                            />
                                            {isEditing === cat._id && (
                                                <button
                                                    onClick={() => editFileInputRef.current?.click()}
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/edit-img:opacity-100 transition-opacity"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        {isEditing === cat._id && (
                                            <input
                                                type="file"
                                                ref={editFileInputRef}
                                                onChange={handleEditImageChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {isEditing === cat._id ? (
                                            <div className="space-y-2">
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="h-9"
                                                    placeholder="Name"
                                                />
                                                <Input
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    className="h-9 text-xs"
                                                    placeholder="Description"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div>{cat.name}</div>
                                                <div className="text-[10px] text-muted-foreground line-clamp-1">{cat.description}</div>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing === cat._id ? (
                                            <select
                                                value={editParentId}
                                                onChange={(e) => setEditParentId(e.target.value)}
                                                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                <option value="">None</option>
                                                {categories
                                                    .filter(c => !c.parent && c._id !== cat._id)
                                                    .map(c => (
                                                        <option key={c._id} value={c._id}>{c.name}</option>
                                                    ))}
                                            </select>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">
                                                {cat.parent ? (typeof cat.parent === 'object' ? cat.parent.name : categories.find(c => c._id === cat.parent)?.name) : '--'}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing === cat._id ? (
                                            <select
                                                value={editIsActive ? 'true' : 'false'}
                                                onChange={(e) => setEditIsActive(e.target.value === 'true')}
                                                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                <option value="true">Enabled</option>
                                                <option value="false">Disabled</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${cat.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {cat.isActive !== false ? 'Active' : 'Disabled'}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isEditing === cat._id ? (
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleUpdate(cat._id)} className="text-green-600 hover:bg-green-50">
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    setIsEditing(null);
                                                    setEditImage(null);
                                                    setEditImagePreview(null);
                                                    setEditParentId("");
                                                    setEditName("");
                                                    setEditDescription("");
                                                }}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    setIsEditing(cat._id);
                                                    setEditName(cat.name);
                                                    setEditDescription(cat.description || "");
                                                    setExistingImage(cat.image);
                                                    setEditImagePreview(null);
                                                    setEditDisplayOrder(cat.displayOrder || 0);
                                                    setEditIsActive(cat.isActive !== false);
                                                    setEditParentId(cat.parent ? (typeof cat.parent === 'object' ? cat.parent._id : cat.parent) : "");
                                                }}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(cat._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CategoryList;
