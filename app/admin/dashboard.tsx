import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = trpc.system.getStats.useQuery();
  const { data: subscriptions, isLoading: subsLoading } = trpc.payment.getSubscriptions.useQuery();

  if (statsLoading || subsLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-3xl font-bold text-foreground">Admin Dashboard</Text>
            <Text className="text-muted">Harmonia SaaS Overview</Text>
          </View>
          <Pressable 
            onPress={() => router.back()}
            className="p-2 rounded-full bg-secondary"
          >
            <IconSymbol name="xmark" size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-8">
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            icon="person.2.fill" 
            color="bg-blue-500/10" 
            textColor="text-blue-500"
          />
          <StatCard 
            title="Active Subs" 
            value={stats?.activeSubscriptions || 0} 
            icon="checkmark.circle.fill" 
            color="bg-green-500/10" 
            textColor="text-green-500"
          />
          <StatCard 
            title="Revenue" 
            value={`$${((stats?.totalRevenue || 0) / 100).toFixed(2)}`} 
            icon="dollarsign.circle.fill" 
            color="bg-purple-500/10" 
            textColor="text-purple-500"
          />
          <StatCard 
            title="Conversion" 
            value={`${stats?.conversionRate || 0}%`} 
            icon="chart.bar.fill" 
            color="bg-orange-500/10" 
            textColor="text-orange-500"
          />
        </View>

        {/* Recent Subscriptions */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">Recent Subscriptions</Text>
          <View className="bg-secondary/30 rounded-2xl overflow-hidden">
            {subscriptions && subscriptions.length > 0 ? (
              subscriptions.slice(0, 5).map((sub, index) => (
                <View 
                  key={sub.id} 
                  className={`p-4 flex-row items-center justify-between ${
                    index !== 4 ? "border-b border-secondary/50" : ""
                  }`}
                >
                  <View>
                    <Text className="text-foreground font-semibold capitalize">{sub.tier}</Text>
                    <Text className="text-xs text-muted">{new Date(sub.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${
                    sub.status === "active" ? "bg-green-500/20" : "bg-yellow-500/20"
                  }`}>
                    <Text className={`text-xs font-bold ${
                      sub.status === "active" ? "text-green-500" : "text-yellow-500"
                    } capitalize`}>
                      {sub.status}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="p-8 items-center">
                <Text className="text-muted">No recent subscriptions</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-12">
          <Text className="text-xl font-bold text-foreground mb-4">Quick Actions</Text>
          <View className="flex-row gap-4">
            <ActionButton title="Export Data" icon="square.and.arrow.up" />
            <ActionButton title="System Logs" icon="list.bullet.rectangle" />
            <ActionButton title="Settings" icon="gearshape.fill" />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function StatCard({ title, value, icon, color, textColor }: any) {
  return (
    <View className="w-[48%] bg-secondary/30 p-4 rounded-2xl mb-4">
      <View className={`w-10 h-10 rounded-xl ${color} items-center justify-center mb-3`}>
        <IconSymbol name={icon} size={20} color={textColor.replace('text-', '')} />
      </View>
      <Text className="text-muted text-xs mb-1">{title}</Text>
      <Text className={`text-xl font-bold ${textColor}`}>{value}</Text>
    </View>
  );
}

function ActionButton({ title, icon }: any) {
  return (
    <Pressable className="flex-1 bg-secondary/50 p-4 rounded-2xl items-center">
      <IconSymbol name={icon} size={24} color="#8B5CF6" />
      <Text className="text-xs text-foreground mt-2 font-medium">{title}</Text>
    </Pressable>
  );
}
