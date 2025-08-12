"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Hook this up to backend API or email service
  };
  return (
    <>
      <div className="p-6 max-w-lg mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>
            Choose how you want to connect with us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sales">Talk to Sales</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>

            {/* Talk to Sales Form */}
            <TabsContent value="sales">
              <form  action="https://getform.io/f/ayvevveb" method="POST" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your Company" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us how we can help..." required />
                </div>
                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </TabsContent>

            {/* Contact Us Form */}
            <TabsContent value="contact">
              <form action="https://getform.io/f/ayvevveb" method="POST" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="email2">Email Address</Label>
                  <Input id="email2" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
                <div>
                  <Label htmlFor="message2">Message</Label>
                  <Textarea id="message2" name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." required />
                </div>
                <Button type="submit" variant="secondary" className="w-full">Send</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

export default ContactUs