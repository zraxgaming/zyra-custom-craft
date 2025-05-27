
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Database, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminBackups = () => {
  const { toast } = useToast();
  const [backups] = useState([
    {
      id: 1,
      name: "Full Site Backup",
      date: "2024-01-15",
      time: "14:30",
      size: "125 MB",
      type: "full",
      status: "completed"
    },
    {
      id: 2,
      name: "Database Backup",
      date: "2024-01-14",
      time: "12:00",
      size: "45 MB",
      type: "database",
      status: "completed"
    },
    {
      id: 3,
      name: "Files Backup",
      date: "2024-01-13",
      time: "10:15",
      size: "80 MB",
      type: "files",
      status: "completed"
    }
  ]);

  const handleCreateBackup = () => {
    toast({
      title: "Backup Created",
      description: "A new backup has been created successfully.",
    });
  };

  const handleDownloadBackup = (backupId: number) => {
    toast({
      title: "Download Started",
      description: "Backup download has been initiated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return Database;
      case 'database': return Database;
      case 'files': return Upload;
      default: return Database;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Backup Management</h1>
          <Button onClick={handleCreateBackup} className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Create New Backup
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{backups.length}</div>
              <p className="text-xs text-muted-foreground">Available backups</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">250 MB</div>
              <p className="text-xs text-muted-foreground">Total backup size</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 days</div>
              <p className="text-xs text-muted-foreground">Days ago</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Backup History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backups.map((backup) => {
                const TypeIcon = getTypeIcon(backup.type);
                return (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <TypeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{backup.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {backup.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {backup.time}
                          </span>
                          <span>{backup.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadBackup(backup.id)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Backup Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Automatic Backups</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically create backups on a schedule
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cloud Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    Store backups in cloud storage
                  </p>
                </div>
                <Button variant="outline">Setup</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBackups;
