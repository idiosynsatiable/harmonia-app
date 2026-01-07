import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useStripe, PRICING_PLANS, IN_APP_PURCHASES } from '@/lib/stripe-provider';
import { useState } from 'react';

export default function PricingScreen() {
  const { subscription, hasFeature, subscribe, purchase } = useStripe();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    const success = await subscribe(planId);
    setLoading(false);

    if (success) {
      Alert.alert('Success!', 'Your subscription is now active.');
    } else {
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    }
  };

  const handlePurchase = async (itemId: string) => {
    setLoading(true);
    const success = await purchase(itemId);
    setLoading(false);

    if (success) {
      Alert.alert('Success!', 'Purchase complete!');
    } else {
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="p-6 bg-gradient-to-br from-primary/10 to-cyan-500/10">
          <Text className="text-3xl font-bold text-foreground mb-2">Choose Your Plan</Text>
          <Text className="text-base text-muted">
            Unlock the full power of Harmonia with Premium or Ultimate
          </Text>
          
          {subscription.tier !== 'free' && (
            <View className="mt-4 p-4 bg-success/10 rounded-lg">
              <Text className="text-success font-semibold">
                ✓ Current Plan: {PRICING_PLANS.find(p => p.id === subscription.tier)?.name}
              </Text>
            </View>
          )}
        </View>

        {/* Subscription Plans */}
        <View className="p-6">
          <Text className="text-xl font-bold text-foreground mb-4">Subscription Plans</Text>
          
          {PRICING_PLANS.map((plan) => {
            const isCurrentPlan = subscription.tier === plan.id;
            const isPremium = plan.id.includes('premium');
            const isUltimate = plan.id.includes('ultimate');
            
            return (
              <View
                key={plan.id}
                className={`mb-4 p-6 rounded-2xl border-2 ${
                  plan.popular
                    ? 'border-primary bg-primary/5'
                    : isCurrentPlan
                    ? 'border-success bg-success/5'
                    : 'border-border bg-surface'
                }`}
              >
                {plan.popular && (
                  <View className="absolute -top-3 right-4 px-4 py-1 bg-primary rounded-full">
                    <Text className="text-white text-xs font-bold">MOST POPULAR</Text>
                  </View>
                )}

                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-2xl font-bold text-foreground">{plan.name}</Text>
                    {plan.interval !== 'lifetime' && (
                      <Text className="text-sm text-muted">
                        Billed {plan.interval === 'month' ? 'monthly' : 'annually'}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text className="text-3xl font-bold text-primary">
                      ${plan.price}
                    </Text>
                    {plan.interval !== 'lifetime' && (
                      <Text className="text-sm text-muted">/{plan.interval === 'month' ? 'mo' : 'yr'}</Text>
                    )}
                  </View>
                </View>

                {/* Features */}
                <View className="mb-4">
                  {plan.features.map((feature, idx) => (
                    <View key={idx} className="flex-row items-start mb-2">
                      <Text className="text-success mr-2">✓</Text>
                      <Text className="text-foreground flex-1">{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* CTA Button */}
                {plan.id !== 'free' && (
                  <TouchableOpacity
                    onPress={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || loading}
                    className={`py-4 rounded-lg ${
                      isCurrentPlan
                        ? 'bg-muted'
                        : plan.popular
                        ? 'bg-primary'
                        : 'bg-foreground'
                    }`}
                  >
                    <Text className="text-center font-bold text-white">
                      {isCurrentPlan ? 'Current Plan' : loading ? 'Processing...' : 'Subscribe Now'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* In-App Purchases */}
        <View className="p-6 bg-surface/50">
          <Text className="text-xl font-bold text-foreground mb-2">À la Carte Purchases</Text>
          <Text className="text-sm text-muted mb-4">
            Unlock individual features without a subscription
          </Text>

          {IN_APP_PURCHASES.map((item) => {
            const isPurchased = hasFeature(item.id);
            
            return (
              <View
                key={item.id}
                className={`mb-4 p-4 rounded-xl border ${
                  isPurchased ? 'border-success bg-success/5' : 'border-border bg-white'
                }`}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground">{item.name}</Text>
                    <Text className="text-sm text-muted">{item.description}</Text>
                  </View>
                  <Text className="text-xl font-bold text-primary ml-4">${item.price}</Text>
                </View>

                {/* Features */}
                <View className="mb-3">
                  {item.features.map((feature, idx) => (
                    <Text key={idx} className="text-xs text-muted">
                      • {feature}
                    </Text>
                  ))}
                </View>

                {/* Purchase Button */}
                <TouchableOpacity
                  onPress={() => handlePurchase(item.id)}
                  disabled={isPurchased || loading}
                  className={`py-3 rounded-lg ${
                    isPurchased ? 'bg-success' : 'bg-primary'
                  }`}
                >
                  <Text className="text-center font-semibold text-white">
                    {isPurchased ? '✓ Purchased' : loading ? 'Processing...' : 'Buy Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Money-Back Guarantee */}
        <View className="p-6">
          <View className="p-6 bg-primary/10 rounded-2xl">
            <Text className="text-center text-lg font-bold text-foreground mb-2">
              💯 30-Day Money-Back Guarantee
            </Text>
            <Text className="text-center text-sm text-muted">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </Text>
          </View>

          <View className="mt-4 p-6 bg-surface rounded-2xl">
            <Text className="text-center text-sm text-muted">
              All plans include 7-day free trial • Cancel anytime • Secure payment via Stripe
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
