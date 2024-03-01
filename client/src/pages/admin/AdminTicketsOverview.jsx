import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTickets} from "@/Redux/Actions/ticket";
import { useNavigate } from "react-router-dom";
const AdminTicketsOverview = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tokenData = useSelector((state) => state.ticket.tickets);
    const user = JSON.parse(localStorage.getItem("user"));
  
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('ticketId');
  const handleTicketClick = (ticket) => {
    navigate(`/admin/tickets/${ticket.ticketId}`)
  };

  useEffect(() => {
    if (tokenData.length < 1) {
      dispatch(getTickets());
    } else {
      setOriginalData(tokenData);
      setFilteredData(tokenData);
    }
  }, [tokenData]);

  useEffect(() => {
    filterTickets();
  }, [sortBy, sortOrder,originalData]);

  // Function to filter and sort data
  const filterTickets = () => {
    let filtered = [...originalData];
    filtered = filtered.sort((a, b) => {
      const compareValue = sortOrder === 'asc' ? 1 : -1;
      return a[sortBy] > b[sortBy] ? compareValue : -compareValue;
    });
    setFilteredData(filtered);
  };


  return (
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6">Admin Tickets Overview</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-gray-600 text-xs">Sort By:</label>
            <select
              className="bg-gray-100 border text-xs border-gray-300 rounded px-2 py-1"
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value="ticketId">Ticket ID</option>
              <option value="subject">Subject</option>
              <option value="category">Category</option>
              <option value="date">Date</option>
              <option value="status">Status</option>
              <option value="assignedUsername">Assigned To</option>
              <option value="numberOfReplies">Messages</option>
              <option value="count">New Unread</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
  <label htmlFor="sortOrderSelect" className="text-gray-600 text-xs">Sort Order:</label>
  <select
    id="sortOrderSelect"
    className="bg-gray-100 border text-xs border-gray-300 rounded px-2 py-1"
    onChange={(e) => setSortOrder(e.target.value)}
    value={sortOrder}
  >
    <option value="asc">Ascending</option>
    <option value="desc">Descending</option>
  </select>
  </div>
  </div>

        <table className="min-w-full text-sm ">
          <thead>
            <tr>
              <th className="text-center">Ticket ID</th>
              <th className="text-center">Subject</th>
              <th className="text-center">Category</th>
              <th className="text-center">Date</th>
              <th className="text-center">Status</th>
              <th className="text-center">Assigned To</th>
              <th className="text-center">Messages</th>
              <th className="text-center">New Unread</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((ticket) => (
              <tr key={ticket.ticketId}  onClick={() => handleTicketClick(ticket)} className="border-b  border-gray-200 hover:bg-gray-100 cursor-pointer">
                <td className="py-2 text-center">{ticket.ticketId}</td>
                <td className="py-2 text-center">{ticket.subject}</td>
                <td className="py-2 text-center">{ticket.category}</td>
                <td className="py-2 text-center">{ticket.date}</td>
                <td className="py-2 text-center">{ticket.status ? 'Open' : 'Closed'}</td>
                <td className="py-2 text-center">{ticket.assignedUsername}</td>
                <td className="py-2 text-center">{ticket.numberOfReplies}</td>
                <td className="py-2 text-center">{ticket.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default AdminTicketsOverview;
