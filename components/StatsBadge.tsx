import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Flame } from 'lucide-react-native';
import { strings, formatString } from '../lib/i18n';
import { DailyStats } from '../types';

interface StatsBadgeProps {
  stats: DailyStats;
  inline?: boolean;
}

export default function StatsBadge({ stats, inline = false }: StatsBadgeProps) {
  if (inline) {
    return (
      <View style={styles.inlineContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.inlineBadge}
        >
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#10B981' }]}>
                <Target size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.statValue}>{stats.correct}</Text>
                <Text style={styles.statLabel}>Doğru</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#EF4444' }]}>
                <Target size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.statValue}>{stats.wrong}</Text>
                <Text style={styles.statLabel}>Yanlış</Text>
              </View>
            </View>
            
            {stats.streak > 0 && (
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#F97316' }]}>
                  <Flame size={16} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.statValue}>{stats.streak}</Text>
                  <Text style={styles.statLabel}>Seri</Text>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
        style={styles.badge}
      >
        <Text style={styles.statsText}>
          {formatString(strings.todayStats, { 
            correct: stats.correct.toString(), 
            wrong: stats.wrong.toString() 
          })}
        </Text>
        {stats.streak > 0 && (
          <Text style={styles.streakText}>
            {formatString(strings.streak, { days: stats.streak.toString() })}
          </Text>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    right: 20,
    zIndex: 10,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  inlineContainer: {
    marginVertical: 20,
  },
  inlineBadge: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
});