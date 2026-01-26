"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import TicketFormModal from '@/components/TicketFormModal';
import TicketDetailModal from '@/components/TicketDetailModal';
import StatusResolutionModal from '@/components/StatusResolutionModal';
import { isSameDay, parseISO } from 'date-fns';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [resolutionMode, setResolutionMode] = useState<'solved' | 'blocked'>('solved');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [solvingTicket, setSolvingTicket] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter logic
  const filteredTickets = tickets.filter(ticket => {
    // Handling both cases: DB field name iso_date and potential frontend fallback isoDate
    const dateField = ticket.iso_date || ticket.isoDate;
    if (!dateField) return true;

    const matchesDate = selectedDate ? isSameDay(parseISO(dateField), selectedDate) : true;
    const matchesSearch = (ticket.title || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDate && matchesSearch;
  });

  const handleAddTicket = async (newTicket: any) => {
    const ticketWithId = {
      ...newTicket,
      id: Math.random().toString(36).substr(2, 9),
      iso_date: new Date().toISOString().split('T')[0],
      date_range: "Recently added"
    };

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketWithId),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setTickets(prev => [ticketWithId, ...prev]);
      }
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  const handleTicketMove = async (ticketId: string, newStatus: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.status === newStatus) return;

    if (newStatus === 'completed') {
      handleSolveClick(ticketId);
      return;
    }
    if (newStatus === 'blocked') {
      handleBlockClick(ticketId);
      return;
    }

    // Optimistic update
    const previousTickets = [...tickets];
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));

    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        body: JSON.stringify({ id: ticketId, status: newStatus }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (error) {
      setTickets(previousTickets);
      console.error("Move failed:", error);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets?id=${ticketId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
        if (selectedTicket?.id === ticketId) setIsDetailOpen(false);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  const handleEditTicket = (ticket: any) => {
    setIsDetailOpen(false);
    setSelectedTicket(ticket);
    setIsAddTicketOpen(true);
  };

  const handleCommentAdded = (ticketId: string, lastComment: string, commentCount: number) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, last_comment: lastComment, comment_count: commentCount } : t
    ));
  };

  const handleUpdateTicket = async (updatedData: any) => {
    const previousTickets = [...tickets];

    // Logic for image upload if file is provided
    let finalImageUrl = updatedData.image_url;
    if (updatedData.file) {
      const formData = new FormData();
      formData.append('file', updatedData.file);
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          finalImageUrl = uploadData.url;
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }

    const updatePayload = {
      ...updatedData,
      image_url: finalImageUrl,
      description: updatedData.description || null,
    };
    delete updatePayload.file; // Don't send file to PATCH

    // Optimistic update
    setTickets(prev => prev.map(t => t.id === updatePayload.id ? { ...t, ...updatePayload } : t));
    setIsAddTicketOpen(false);

    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        body: JSON.stringify(updatePayload),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }
    } catch (error: any) {
      setTickets(previousTickets);
      console.error("Update failed:", error);
      alert("Update failed: " + error.message);
    } finally {
      setSelectedTicket(null);
    }
  };

  const handleSolveClick = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSolvingTicket(ticket);
      setResolutionMode('solved');
      setIsResolutionOpen(true);
    }
  };

  const handleBlockClick = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSolvingTicket(ticket);
      setResolutionMode('blocked');
      setIsResolutionOpen(true);
    }
  };

  const handleResolutionConfirm = async (solution: string) => {
    if (!solvingTicket) return;

    const ticketId = solvingTicket.id;
    const status = resolutionMode === 'solved' ? 'completed' : 'blocked';
    const previousTickets = [...tickets];

    // Optimistic update
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, status: status, solution: solution } : t
    ));
    setIsResolutionOpen(false);

    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        body: JSON.stringify({
          id: ticketId,
          status: status,
          solution: solution
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }
    } catch (error: any) {
      setTickets(previousTickets);
      console.error(`${resolutionMode} failed:`, error);
      alert(`${resolutionMode} failed: ` + error.message);
    } finally {
      setSolvingTicket(null);
    }
  };

  const handleDeleteAllByStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/tickets?status=${status}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTickets(prev => prev.filter(t => t.status !== status));
      }
    } catch (error) {
      console.error("Delete all failed:", error);
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-white">
        <div className="w-20 border-r border-gray-200"></div>
        <div className="flex-1"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isCalendarOpen={isCalendarOpen}
          toggleCalendar={() => setIsCalendarOpen(!isCalendarOpen)}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddTicketClick={() => setIsAddTicketOpen(true)}
        />

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <KanbanBoard
            tickets={filteredTickets}
            onTicketMove={handleTicketMove}
            onDelete={handleDeleteTicket}
            onSolve={handleSolveClick}
            onBlock={handleBlockClick}
            onDeleteAll={handleDeleteAllByStatus}
            onTicketClick={handleTicketClick}
          />
        )}

        <TicketFormModal
          isOpen={isAddTicketOpen}
          onClose={() => { setIsAddTicketOpen(false); setSelectedTicket(null); }}
          onSave={selectedTicket ? handleUpdateTicket : handleAddTicket}
          initialData={selectedTicket}
        />

        <TicketDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          ticket={selectedTicket}
          onEdit={handleEditTicket}
          onCommentAdded={handleCommentAdded}
        />

        <StatusResolutionModal
          isOpen={isResolutionOpen}
          onClose={() => setIsResolutionOpen(false)}
          ticketTitle={solvingTicket?.title || ""}
          onConfirm={handleResolutionConfirm}
          mode={resolutionMode}
        />
      </div>
    </div>
  );
}
