import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RuleService } from '../services/rule.service';
import { AuditService } from '../services/audit.service';
import { SystemSettings } from '../models/rule.model';
import { AuditLogEntry } from '../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="card">
      <h2>System Administration</h2>
      
      <div class="grid grid-2" style="margin: 20px 0;">
        <a routerLink="/admin/rules" class="btn btn-primary">
          Manage Payer Rule Sets
        </a>
        <button class="btn btn-secondary" (click)="showSettings = !showSettings">
          System Settings
        </button>
      </div>

      <div *ngIf="showSettings" class="card">
        <h3>System Settings</h3>
        <div *ngIf="settings">
          <div class="form-group">
            <label>Default Expiration Threshold (Days):</label>
            <input type="number" [(ngModel)]="settings.defaultExpirationThresholdDays" class="form-control">
          </div>
          <div class="form-group">
            <label>Email Notifications Enabled:</label>
            <input type="checkbox" [(ngModel)]="settings.emailNotificationsEnabled">
          </div>
          <div class="form-group">
            <label>Weekly Digest Day:</label>
            <select [(ngModel)]="settings.weeklyDigestDay" class="form-control">
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>
          <button class="btn btn-primary" (click)="saveSettings()">
            Save Settings
          </button>
        </div>
      </div>

      <h3>Recent Audit Log</h3>
      <div *ngIf="loadingAudit" class="loading">Loading audit logs...</div>
      <table class="table" *ngIf="!loadingAudit && auditLogs.length > 0">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Entity Type</th>
            <th>Entity ID</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let log of auditLogs">
            <td>{{ log.timestamp | date:'short' }}</td>
            <td>{{ log.username }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.entityType }}</td>
            <td>{{ log.entityId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AdminComponent implements OnInit {
  showSettings = false;
  settings: SystemSettings | null = null;
  auditLogs: AuditLogEntry[] = [];
  loadingAudit = false;

  constructor(
    private ruleService: RuleService,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadAuditLogs();
  }

  loadSettings(): void {
    this.ruleService.getSystemSettings().subscribe({
      next: (settings) => {
        this.settings = settings;
      },
      error: (err) => {
        console.error('Failed to load settings', err);
      }
    });
  }

  saveSettings(): void {
    if (!this.settings) return;

    this.ruleService.updateSystemSettings(this.settings).subscribe({
      next: () => {
        alert('Settings saved successfully');
      },
      error: (err) => {
        console.error('Failed to save settings', err);
        alert('Failed to save settings');
      }
    });
  }

  loadAuditLogs(): void {
    this.loadingAudit = true;
    this.auditService.getAuditLogs({ limit: 50 }).subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.loadingAudit = false;
      },
      error: (err) => {
        console.error('Failed to load audit logs', err);
        this.loadingAudit = false;
      }
    });
  }
}