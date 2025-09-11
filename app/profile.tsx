import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Target, Flame, BookOpen, Award, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { getDailyStats, getWords, getTotalStats } from '@/lib/storage';


interface ProfileStats {
  totalWords: number;
  todayCorrect: number;
  todayWrong: number;
  streak: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<ProfileStats>({
    totalWords: 0,
    todayCorrect: 0,
    todayWrong: 0,
    streak: 0,
    totalCorrect: 0,
    totalWrong: 0,
    accuracy: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const dailyStats = await getDailyStats();
    const words = await getWords();
    const totalStats = await getTotalStats();
    
    const accuracy = totalStats.totalCorrect + totalStats.totalWrong > 0 
      ? Math.round((totalStats.totalCorrect / (totalStats.totalCorrect + totalStats.totalWrong)) * 100)
      : 0;

    setStats({
      totalWords: words.length,
      todayCorrect: dailyStats.correct,
      todayWrong: dailyStats.wrong,
      streak: dailyStats.streak,
      totalCorrect: totalStats.totalCorrect,
      totalWrong: totalStats.totalWrong,
      accuracy,
    });
  };

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    color 
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const achievements = [
    {
      id: '1',
      title: 'İlk Adım',
      description: 'İlk kelimeni ekledi',
      unlocked: stats.totalWords > 0,
      icon: <BookOpen size={20} color="#FFFFFF" />,
    },
    {
      id: '2',
      title: 'Kelime Ustası',
      description: '10 kelime ekle',
      unlocked: stats.totalWords >= 10,
      icon: <Award size={20} color="#FFFFFF" />,
    },
    {
      id: '3',
      title: 'Doğruluk Şampiyonu',
      description: '10 doğru cevap ver',
      unlocked: stats.totalCorrect >= 10,
      icon: <Trophy size={20} color="#FFFFFF" />,
    },
    {
      id: '4',
      title: 'Ateşli Seri',
      description: '3 gün üst üste oyna',
      unlocked: stats.streak >= 3,
      icon: <Flame size={20} color="#FFFFFF" />,
    },
  ];

  return (
    <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.container}>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>Profilim</Text>
            </View>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            {/* Overall Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
              <View style={styles.statsGrid}>
                <StatCard
                  icon={<BookOpen size={20} color="#FFFFFF" />}
                  title="Toplam Kelime"
                  value={stats.totalWords}
                  color="#8B5CF6"
                />
                <StatCard
                  icon={<Trophy size={20} color="#FFFFFF" />}
                  title="Toplam Doğru"
                  value={stats.totalCorrect}
                  color="#F59E0B"
                />
                <StatCard
                  icon={<Flame size={20} color="#FFFFFF" />}
                  title="Günlük Seri"
                  value={stats.streak}
                  subtitle="gün"
                  color="#F97316"
                />
                <StatCard
                  icon={<Target size={20} color="#FFFFFF" />}
                  title="Doğruluk Oranı"
                  value={`${stats.accuracy}%`}
                  color="#06B6D4"
                />
              </View>
            </View>

            {/* Achievements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Başarılar</Text>
              <View style={styles.achievementsContainer}>
                {achievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      achievement.unlocked && styles.achievementUnlocked,
                    ]}
                  >
                    <View
                      style={[
                        styles.achievementIcon,
                        {
                          backgroundColor: achievement.unlocked
                            ? '#10B981'
                            : '#9CA3AF',
                        },
                      ]}
                    >
                      {achievement.icon}
                    </View>
                    <View style={styles.achievementContent}>
                      <Text
                        style={[
                          styles.achievementTitle,
                          achievement.unlocked && styles.achievementTitleUnlocked,
                        ]}
                      >
                        {achievement.title}
                      </Text>
                      <Text
                        style={[
                          styles.achievementDescription,
                          achievement.unlocked && styles.achievementDescriptionUnlocked,
                        ]}
                      >
                        {achievement.description}
                      </Text>
                    </View>
                    {achievement.unlocked && (
                      <View style={styles.achievementBadge}>
                        <Text style={styles.achievementBadgeText}>✓</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6,
  },
  achievementUnlocked: {
    opacity: 1,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  achievementTitleUnlocked: {
    color: '#1F2937',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  achievementDescriptionUnlocked: {
    color: '#6B7280',
  },
  achievementBadge: {
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});