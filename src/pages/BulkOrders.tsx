
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Users, Package, Phone, Mail, FileText, Calculator, Truck } from "lucide-react";

const BulkOrders: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "",
    productCategory: "",
    quantity: "",
    description: "",
    timeline: "",
    budget: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      toast("Please fill in all required fields", {
        description: "Company name, contact person, email, and phone are required."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: `${formData.contactPerson} (${formData.companyName})`,
        email: formData.email,
        subject: `Bulk Order Request - ${formData.companyName}`,
        message: `
Company: ${formData.companyName}
Contact Person: ${formData.contactPerson}
Phone: ${formData.phone}
Business Type: ${formData.businessType}
Product Category: ${formData.productCategory}
Quantity: ${formData.quantity}
Timeline: ${formData.timeline}
Budget: ${formData.budget}

Description:
${formData.description}
        `
      });

      if (error) throw error;

      toast("Bulk Order Request Submitted!", {
        description: "We'll contact you within 24 hours to discuss your requirements."
      });

      // Reset form
      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        businessType: "",
        productCategory: "",
        quantity: "",
        description: "",
        timeline: "",
        budget: ""
      });
    } catch (error) {
      console.error("Error submitting bulk order request:", error);
      toast("Error submitting request", {
        description: "Please try again or contact us directly."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bulk Orders & B2B Solutions</h1>
          <p className="text-xl text-gray-600 mb-6">
            Special pricing and custom solutions for businesses, educational institutions, and bulk purchases
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Corporate Solutions
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Educational Discounts
            </div>
            <div className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Volume Pricing
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Benefits & Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-green-100 text-green-800">Save</Badge>
                    <div>
                      <h4 className="font-medium">Volume Discounts</h4>
                      <p className="text-sm text-gray-600">Up to 30% off on bulk orders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800">Support</Badge>
                    <div>
                      <h4 className="font-medium">Dedicated Account Manager</h4>
                      <p className="text-sm text-gray-600">Personal support for your orders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-purple-100 text-purple-800">Custom</Badge>
                    <div>
                      <h4 className="font-medium">Custom Solutions</h4>
                      <p className="text-sm text-gray-600">Tailored products for your needs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-orange-100 text-orange-800">Fast</Badge>
                    <div>
                      <h4 className="font-medium">Priority Shipping</h4>
                      <p className="text-sm text-gray-600">Faster delivery for bulk orders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-gray-100 text-gray-800">Terms</Badge>
                    <div>
                      <h4 className="font-medium">Flexible Payment</h4>
                      <p className="text-sm text-gray-600">Net 30 terms available</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Industries We Serve:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Education</Badge>
                    <Badge variant="outline">Manufacturing</Badge>
                    <Badge variant="outline">Research</Badge>
                    <Badge variant="outline">Startups</Badge>
                    <Badge variant="outline">Government</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">+91 9876543210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">bulk@yorbot.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Free shipping on orders ₹10,000+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Request Bulk Order Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select onValueChange={(value) => handleSelectChange("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="education">Educational Institution</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="research">Research & Development</SelectItem>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productCategory">Product Category</Label>
                      <Select onValueChange={(value) => handleSelectChange("productCategory", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development-boards">Development Boards</SelectItem>
                          <SelectItem value="sensors">Sensors & Modules</SelectItem>
                          <SelectItem value="components">Electronic Components</SelectItem>
                          <SelectItem value="tools">Tools & Equipment</SelectItem>
                          <SelectItem value="kits">Educational Kits</SelectItem>
                          <SelectItem value="custom">Custom Solution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Estimated Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        placeholder="e.g., 100 units, 50 sets"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select onValueChange={(value) => handleSelectChange("budget", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                          <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                          <SelectItem value="1l-5l">₹1,00,000 - ₹5,00,000</SelectItem>
                          <SelectItem value="5l-10l">₹5,00,000 - ₹10,00,000</SelectItem>
                          <SelectItem value="above-10l">Above ₹10,00,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timeline">Timeline/Deadline</Label>
                    <Select onValueChange={(value) => handleSelectChange("timeline", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="When do you need this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1-week">Within 1 week</SelectItem>
                        <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Project Description & Requirements</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Please describe your project, specific requirements, technical specifications, or any custom needs..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-yorbot-orange hover:bg-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Submitting Request...
                      </>
                    ) : (
                      "Submit Bulk Order Request"
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    Our team will review your request and contact you within 24 hours with a customized quote.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BulkOrders;
