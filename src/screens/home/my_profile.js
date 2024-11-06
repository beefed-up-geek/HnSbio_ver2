// src/screens/home/my_profile.js

import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './my_profile_styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const My_profile_screen = () => {
	const navigation = useNavigation();

	return (
	<View style={styles.container}>
		<View style={styles.profileImageContainer}>
			<Image
				source={require('../../images/home/my_profile/sampleProfile.png')}
				style={styles.profileImage}
			/>
			<TouchableOpacity style={styles.cameraIconContainer}>
				<Image
					source={require('../../images/home/my_profile/camera.png')}
					style={styles.cameraIcon}
				/>
			</TouchableOpacity>
		</View>

		{/* Profile Details */}
		<View style={styles.detailsContainer}>
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>닉네임</Text>
				<TouchableOpacity 
					style={styles.textButtonWrapper} 
				>
					<Text style={styles.detailValue}>김콩팥</Text>
					<Image
						source={require('../../images/home/my_profile/go.png')}
						style={styles.goIcon}
						/>  
				</TouchableOpacity>
			</View>
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>성별</Text>
				<TouchableOpacity 
					style={styles.textButtonWrapper} 
				>
					<Text style={styles.detailValue}>남성</Text>
					<Image
						source={require('../../images/home/my_profile/go.png')}
						style={styles.goIcon}
					/>  
				</TouchableOpacity>
			</View>
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>생년월일</Text>
				<TouchableOpacity 
					style={styles.textButtonWrapper} 
				>
					<Text style={styles.detailValue}>1978.09.23</Text>
					<Image
						source={require('../../images/home/my_profile/go.png')}
						style={styles.goIcon}
					/>  
				</TouchableOpacity>
			</View>
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>키</Text>
				<TouchableOpacity 
					style={styles.textButtonWrapper} 
				>
					<Text style={styles.detailValue}>169 cm</Text>
					<Image
						source={require('../../images/home/my_profile/go.png')}
						style={styles.goIcon}
					/>  
				</TouchableOpacity>
			</View>
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>몸무게</Text>
				<TouchableOpacity 
					style={styles.textButtonWrapper} 
				>
					<Text style={styles.detailValue}>62 kg</Text>
					<Image
						source={require('../../images/home/my_profile/go.png')}
						style={styles.goIcon}
					/>  
				</TouchableOpacity>
			</View>
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>콩팥병 상태</Text>
				<TouchableOpacity 
					style={styles.textButtonWrapper} 
				>
					<Text style={styles.detailValue}>해당사항 없음</Text>
					<Image
						source={require('../../images/home/my_profile/go.png')}
						style={styles.goIcon}
					/>  
				</TouchableOpacity>
			</View>
			<View style={styles.detailLastRow}>
				<Text style={styles.detailLabel}>기저질환 정보</Text>
				<TouchableOpacity 
					style={styles.textButtonWrapper} 
				>
					<Text style={styles.detailValue}>당뇨</Text>
					<Image
						source={require('../../images/home/my_profile/go.png')}
						style={styles.goIcon}
					/>  
				</TouchableOpacity>
			</View>
		</View>

	</View>
	);
}

export default My_profile_screen;