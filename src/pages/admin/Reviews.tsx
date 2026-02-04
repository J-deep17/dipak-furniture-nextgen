import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Loader2 } from "lucide-react";

interface Review {
    _id: string; // The review actually doesn't have an ID in the current schema... wait.
    // The current schema embeds reviews in products. So we need product ID + review index/ID.
    // Let's assume we fetch products with pending reviews.
    productId: string;
    productName: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
    isApproved: boolean;
    reviewId: string; // We'll need to generate or find this
}

// We need a special endpoint to fetch all pending reviews across all products.
// Since we don't have that yet, let's update the plan to create it.
// Wait, I can't update the plan inside write_to_file.
// I will create a frontend component that *assumes* the existence of an endpoint,
// or I can fetch all products and client-side filter (bad performance but works for MVP).

// Better approach: fetch all products and flatten reviews.
// GET /api/products returns all products. I can filter there.

const Reviews = () => {
    const queryClient = useQueryClient();

    // Fetch all products to find reviews
    // Ideally we should have a specific endpoint /api/reviews/pending
    const { data: products, isLoading } = useQuery({
        queryKey: ["products-with-reviews"],
        queryFn: async () => {
            const res = await api.get("/products");
            return res.data;
        }
    });

    const approveMutation = useMutation({
        mutationFn: async ({ productId, reviewId }: { productId: string, reviewId: string }) => {
            await api.put(`/products/${productId}/reviews/${reviewId}/approve`);
        },
        onSuccess: () => {
            toast.success("Review approved");
            queryClient.invalidateQueries({ queryKey: ["products-with-reviews"] });
        },
        onError: () => {
            toast.error("Failed to approve review");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ productId, reviewId }: { productId: string, reviewId: string }) => {
            await api.delete(`/products/${productId}/reviews/${reviewId}`);
        },
        onSuccess: () => {
            toast.success("Review rejected/deleted");
            queryClient.invalidateQueries({ queryKey: ["products-with-reviews"] });
        },
        onError: () => {
            toast.error("Failed to delete review");
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Flatten pending reviews
    const pendingReviews = products?.flatMap((product: any) =>
        (product.reviews || [])
            .filter((r: any) => !r.isApproved)
            .map((r: any) => ({
                ...r,
                productId: product.id || product._id,
                productName: product.name,
                reviewId: r._id // Mongoose subdocuments have _id by default
            }))
    ) || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Review Management</h2>
                    <p className="text-muted-foreground">Approve or reject customer reviews.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Reviews</CardTitle>
                    <CardDescription>
                        {pendingReviews.length} reviews start waiting for approval.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {pendingReviews.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No pending reviews found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Review</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingReviews.map((review: any) => (
                                    <TableRow key={review.reviewId}>
                                        <TableCell className="font-medium">{review.productName}</TableCell>
                                        <TableCell>{review.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                                {review.rating}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate" title={review.comment}>
                                            {review.comment}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0"
                                                onClick={() => deleteMutation.mutate({ productId: review.productId, reviewId: review.reviewId })}
                                            >
                                                <X className="h-4 w-4 text-red-500" />
                                                <span className="sr-only">Reject</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => approveMutation.mutate({ productId: review.productId, reviewId: review.reviewId })}
                                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                            >
                                                <Check className="h-4 w-4" />
                                                <span className="sr-only">Approve</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Reviews;
