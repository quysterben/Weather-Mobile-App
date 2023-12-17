import { useState, useEffect } from "react";

import { View, StatusBar, Image, TouchableOpacity, Text, ScrollView } from "react-native"
import { ArrowUturnLeftIcon } from "react-native-heroicons/outline"
import { theme } from "../theme";
import { weatherImages } from "../constants";

import moment from "moment";
import { Cloud } from "react-native-feather";

export default function DetailScreen({ route, navigation }) {
    const [isDay, setIsDay] = useState(true);
    useEffect(() => {
        if (moment().isAfter(moment('18:00', 'HH:mm')) || moment().isBefore(moment('06:00', 'HH:mm'))) {
            setIsDay(false);
        } else {
            setIsDay(true);
        }
    }, [])

    const data = route.params.item;
    const aqData = route.params.aq;

    const date = new Date(data.date);
    const options = { weekday: 'long' };
    let dayName = date.toLocaleDateString('en', options);
    dayName = dayName.split(',')[0];
    if (moment(data.date).isSame(moment(), 'day')) {
        dayName = 'Today';
    }

    const handleUVShow = (uv) => {
        if (uv <= 2) return 'Low';
        if (uv <= 5) return 'Moderate';
        if (uv <= 7) return 'High';
        if (uv <= 10) return 'Very High';
        if (uv > 10) return 'Extreme';
    }

    return (
        <View className="flex-1 relative">
            <StatusBar style="light" />
            <Image
                blurRadius={70}
                source={isDay ? require('../assets/images/day.png') : require('../assets/images/night.png')}
                className="absolute w-full h-full" />

            <View style={{ height: '7%' }} className="mx-4 mt-8 relative z-50">
                <View
                    className="flex-row justify-start items-center rounded-full"
                >
                    <TouchableOpacity
                        className="rounded-full p-3 m-1"
                        onPress={() => navigation.navigate('Home')}
                        style={{ backgroundColor: theme.bgWhite(0.1) }}>
                        <ArrowUturnLeftIcon size="25" color="white" />
                    </TouchableOpacity>
                    <Text className="text-white ml-12 text-lg font-bold">
                        {dayName + " " + moment(data.date).format('DD-MM-YYYY')}
                    </Text>
                </View>
            </View>


            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}>
                {
                    dayName === 'Today' &&
                    <View className="flex my-2 w-[94%] rounded-3xl py-3 mx-auto"
                        style={{ backgroundColor: theme.bgWhite(0.2) }}>
                        <Text className="text-white font-bold text-lg mx-auto mb-2">
                            Air condition
                        </Text>
                        <View className="flex flex-row justify-between items-center mb-2 mx-8 ">
                            <Text className="text-white">
                                CO: {aqData.co}
                            </Text>
                            <Text className="text-white">
                                NO2: {aqData.no2}
                            </Text>
                            <Text className="text-white">
                                O3: {aqData.o3}
                            </Text>
                            <Text className="text-white">
                                SO2: {aqData.so2}
                            </Text>
                        </View>
                    </View>
                }
                {
                    data.hour.map((item, index) => {
                        return (
                            <View key={index} className="my-1">
                                <Text className="text-white font-bold text-lg">
                                    {moment(item.time).format('hh:mm A')}
                                </Text>
                                <View
                                    className="flex my-2 w-full rounded-3xl py-3 space-y-1 mr-4"
                                    style={{ backgroundColor: theme.bgWhite(0.2) }}>
                                    <View className="flex flex-row justify-between items-center mb-2">
                                        <View className="flex flex-row items-center">
                                            <View className="ml-1 flex">
                                                <View className="flex-row space-x-2 items-center mx-4 my-2">
                                                    <Image source={require('../assets/icons/wind.png')} className="w-6 h-6" />
                                                    <Text className="text-white font-semibold text-base">{item.wind_kph} km/h</Text>
                                                </View>
                                                <View className="flex-row space-x-2 items-center mx-4 my-2">
                                                    <Image source={require('../assets/icons/uv.png')} className="w-6 h-6" />
                                                    <Text className="text-white font-semibold text-base">{handleUVShow(item.uv)}</Text>
                                                </View>
                                                <View className="flex-row space-x-2 items-center mx-4 my-2">
                                                    <Image source={require('../assets/icons/drop.png')} className="w-6 h-6" />
                                                    <Text className="text-white font-semibold text-base">{item.humidity}%</Text>
                                                </View>
                                                <View className="flex-row space-x-2 items-center mx-4 my-2">
                                                    <Cloud stroke="white" width={20} height={20} />
                                                    <Text className="text-white font-semibold text-base">{item.cloud}%</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View className="flex items-center justify-center mx-auto">
                                            <Image
                                                source={weatherImages[item.condition.text || 'other']}
                                                className="w-20 h-20" />
                                            <Text className="text-white font-bold text-lg">
                                                {item.condition.text}
                                            </Text>
                                            <Text className="text-white justify-self-end font-bold text-lg">
                                                {item.temp_c}°C
                                            </Text>

                                        </View>
                                    </View>

                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}
