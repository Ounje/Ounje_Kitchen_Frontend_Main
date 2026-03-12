// "use client";

// import { useState, useEffect } from 'react';
// import { usersService } from '@/lib/api/services/users.service';

// export default function UsersPage() {
//   const [activeTab, setActiveTab] = useState<'customers' | 'vendors' | 'riders'>('customers');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadUsers();
//   }, [activeTab]);

//   const loadUsers = async () => {
//     try {
//       let data;
//       if (activeTab === 'customers') {
//         data = await usersService.getCustomers({ page: 1, limit: 20 });
//       } else if (activeTab === 'vendors') {
//         data = await usersService.getVendors({ page: 1, limit: 20 });
//       } else {
//         data = await usersService.getRiders({ page: 1, limit: 20 });
//       }
//       setUsers(data.data);
//     } catch (error) {
//       console.error('Failed to load users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSuspend = async (id: string) => {
//     try {
//       if (activeTab === 'customers') {
//         await usersService.suspendCustomer(id);
//       }
//       // Reload data
//       loadUsers();
//     } catch (error) {
//       console.error('Failed to suspend user:', error);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-6">User & Staff</h1>
      
//       {/* Tabs */}
//       <div className="flex gap-4 mb-6 border-b">
//         <button 
//           onClick={() => setActiveTab('customers')}
//           className={activeTab === 'customers' ? 'border-b-2 border-primary font-semibold' : ''}
//         >
//           Customers
//         </button>
//         <button 
//           onClick={() => setActiveTab('vendors')}
//           className={activeTab === 'vendors' ? 'border-b-2 border-primary font-semibold' : ''}
//         >
//           Vendors
//         </button>
//         <button 
//           onClick={() => setActiveTab('riders')}
//           className={activeTab === 'riders' ? 'border-b-2 border-primary font-semibold' : ''}
//         >
//           Riders
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {users.map((user: any) => (
//               <tr key={user.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user.isActive ? 'Active' : 'Suspended'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {user.isActive ? (
//                     <button 
//                       onClick={() => handleSuspend(user.id)}
//                       className="text-red-600 hover:text-red-800 text-sm"
//                     >
//                       Suspend
//                     </button>
//                   ) : (
//                     <button 
//                       onClick={() => handleActivate(user.id)}
//                       className="text-green-600 hover:text-green-800 text-sm"
//                     >
//                       Activate
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useMemo } from 'react';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { Modal } from '@/components/dashboard/users/modal';
import { RiderModalContent } from '@/components/dashboard/users/rider-modal';
import { VendorModalContent } from '@/components/dashboard/users/vendor-modal';
import { CustomerModalContent } from '@/components/dashboard/users/customer-modal';
import { StaffModalContent } from '@/components/dashboard/users/staff-modal';
import {
  riderData,
  vendorData,
  customerData,
  staffData,
  UserType,
  Rider,
  Vendor,
  Customer,
  Staff,
} from '@/lib/user-data';

type TableData = Rider | Vendor | Customer | Staff;

const ITEMS_PER_PAGE = 7;

export default function UsersPage() {
  const [userType, setUserType] = useState<UserType>('riders');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<TableData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterAccountStatus, setFilterAccountStatus] = useState('');

  // Get data based on selected user type
  const getData = () => {
    switch (userType) {
      case 'riders':
        return riderData;
      case 'vendors':
        return vendorData;
      case 'customers':
        return customerData;
      case 'staff':
        return staffData;
      default:
        return [];
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    let data = getData();

    if (filterName) {
      data = data.filter((item) =>
        (item as any).name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (userType !== 'staff' && filterEmail) {
      data = data.filter(
        (item) =>
          (item as any).email?.toLowerCase().includes(filterEmail.toLowerCase()) ||
          false
      );
    }

    if (userType === 'riders' || userType === 'vendors' || userType === 'customers') {
      if (filterPhone) {
        data = data.filter((item) =>
          (item as any).address?.toLowerCase().includes(filterPhone.toLowerCase())
        );
      }
    }

    if (userType === 'staff' && filterDepartment) {
      data = data.filter((item) =>
        (item as Staff)?.department?.toLowerCase().includes(filterDepartment.toLowerCase())
      );
    }

    if (filterAccountStatus) {
      data = data.filter((item) =>
        (item as any).statusOfAccount
          .toLowerCase()
          .includes(filterAccountStatus.toLowerCase())
      );
    }

    return data;
  }, [userType, filterName, filterEmail, filterPhone, filterDepartment, filterAccountStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when user type changes
  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (user: TableData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with title and dropdown */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Users & Staff</h1>
          <select
            value={userType}
            onChange={(e) => handleUserTypeChange(e.target.value as UserType)}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-border cursor-pointer outline-none transition-opacity"
          >
            <option value="riders">Riders</option>
            <option value="vendors">Vendor</option>
            <option value="customers">Customer</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {/* Filter inputs */}
        <div className="bg-card rounded-lg p-6 border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>

            {(userType === 'riders' || userType === 'vendors' || userType === 'customers') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  E-mail
                </label>
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={filterEmail}
                  onChange={(e) => {
                    setFilterEmail(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            )}

            {(userType === 'riders' || userType === 'vendors' || userType === 'customers') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {userType === 'customers' ? 'Address' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filterPhone}
                  onChange={(e) => {
                    setFilterPhone(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            )}

            {userType === 'staff' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="Search by department..."
                  value={filterDepartment}
                  onChange={(e) => {
                    setFilterDepartment(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            )}

            {userType !== 'staff' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Status
                </label>
                <input
                  type="text"
                  placeholder="Search by status..."
                  value={filterAccountStatus}
                  onChange={(e) => {
                    setFilterAccountStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary border-b border-border">
                  <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                    S/N
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                    Name
                  </th>

                  {userType === 'riders' && (
                    <>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Delivery Type
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Status of Account
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Total Deliveries
                      </th>
                    </>
                  )}

                  {userType === 'vendors' && (
                    <>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Delivery Type
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Status of Account
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Total Orders
                      </th>
                    </>
                  )}

                  {userType === 'customers' && (
                    <>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Status of Account
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Total Orders
                      </th>
                    </>
                  )}

                  {userType === 'staff' && (
                    <>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Status of Account
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-secondary-foreground">
                        Line Manager
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-foreground">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      <div className="flex items-center gap-3">
                        {item.avatar && (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        {(item as any).name}
                      </div>
                    </td>

                    {userType === 'riders' && (
                      <>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Rider).deliveryType}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Rider).address}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Rider).statusOfAccount}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Rider).totalDeliveries}
                        </td>
                      </>
                    )}

                    {userType === 'vendors' && (
                      <>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Vendor).deliveryType}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Vendor).address}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Vendor).statusOfAccount}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Vendor).totalOrders}
                        </td>
                      </>
                    )}

                    {userType === 'customers' && (
                      <>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Customer).email}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Customer).address}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Customer).statusOfAccount}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Customer).totalOrders}
                        </td>
                      </>
                    )}

                    {userType === 'staff' && (
                      <>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Staff).email}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Staff).department}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Staff).statusOfAccount}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {(item as Staff).lineManager}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-background p-6 border-t border-border">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              totalItems={filteredData.length}
            />
          </div>
        </div>

        {/* Empty state */}
        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No {userType} found matching your filters.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedUser && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {userType === 'riders' && (
            <RiderModalContent rider={selectedUser as Rider} onClose={handleCloseModal} />
          )}
          {userType === 'vendors' && (
            <VendorModalContent vendor={selectedUser as Vendor} onClose={handleCloseModal} />
          )}
          {userType === 'customers' && (
            <CustomerModalContent customer={selectedUser as Customer} onClose={handleCloseModal} />
          )}
          {userType === 'staff' && (
            <StaffModalContent staff={selectedUser as Staff} onClose={handleCloseModal} />
          )}
        </Modal>
      )}
    </>
  );
}
