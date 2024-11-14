// src/screens/medicine/index.js

import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Keyboard, Modal, Image, ScrollView } from 'react-native';
import styles from './styles.js';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const MedicineScreen = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [medications, setMedications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const searchMedicine = async () => {
        try {
            const response = await fetch('http://54.79.61.80:5000/medicine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchText.trim() === '' ? {} : { medicine_name: searchText }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching data:', errorText);
                Alert.alert('데이터를 가져오는 중 오류가 발생했습니다.');
                return;
            }

            const data = await response.json();
            if (data.results) {
                const formattedMedications = data.results.map((item, index) => ({
                    id: String(index),
                    name: item.itemName,
                    englishName: item.ITEM_ENG_NAME,
                    companyName: item.companyName,
                    cautionaryIngr: item.cautionaryIngr && item.cautionaryIngr !== "[]" 
                        ? item.cautionaryIngr.replace(/[\[\]']/g, '').split(', ') 
                        : [],
                    ingredients: item.ingredient && item.ingredient !== "[]" 
                        ? item.ingredient.replace(/[\[\]']/g, '').split(', ') 
                        : [],
                    efficacy: item.efficacy,
                    instruction: item.instruction,
                    caution: item.caution,
                    sotrageInstruction: item.sotrageInstruction,
                }));
                setMedications(formattedMedications);
            } else {
                Alert.alert('검색 결과가 없습니다.');
                setMedications([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        searchMedicine();
    }, []);

    const handleTabChange = (type) => {
        setSearchType(type);
    };

    const renderMedication = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => navigation.navigate('MedicineDetailScreen', {
                name: item.name,
                englishName: item.englishName,
                efficacy: item.efficacy,
                instruction: item.instruction,
                caution: item.caution,
                sotrageInstruction: item.sotrageInstruction,
            })}
        >
            <View style={styles.medicationItem}>
                <Text style={styles.companyName}>{item.companyName}</Text>
                <Text style={styles.medicationName}>{item.name}</Text>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cautionaryContainer}>
                    {item.cautionaryIngr.map((ingredient, index) => (
                        <Text key={`caution-${index}`} style={styles.cautionaryIngredient}>{ingredient}</Text>
                    ))}
                </ScrollView>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsContainer}>
                    {item.ingredients.map((ingredient, index) => (
                        <Text key={`ingredient-${index}`} style={styles.ingredient}>{ingredient}</Text>
                    ))}
                </ScrollView>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Image source={require('../../images/medicine/돋보기.png')} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="약 이름을 검색해 주세요."
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={() => {
                        Keyboard.dismiss();
                        searchMedicine();
                    }}
                    blurOnSubmit={true}
                    keyboardType="default"
                    returnKeyType="search"
                />
            </View>
            
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, searchType === 'name' && styles.activeTab]}
                    onPress={() => handleTabChange('name')}
                >
                    <Text style={styles.tabText}>이름으로 검색</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, searchType === 'ingredient' && styles.activeTab]}
                    onPress={() => handleTabChange('ingredient')}
                >
                    <Text style={styles.tabText}>성분으로 검색</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.helpButton} onPress={toggleModal}>
                    <Image source={require('../../images/medicine/helper.png')} style={styles.helpIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.flatListContainer}>
                <FlatList
                    data={medications}
                    renderItem={renderMedication}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingTop: 16 }}
                />
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>주의 성분 안내</Text>
                        <View style={styles.modalContent}>
                            <View style={styles.row}>
                                <Image source={require('../../images/medicine/red_ingr.png')} style={styles.icon} />
                                <Text style={styles.warningText}>은 신장에 부담을 줄 수 있는 성분이에요.</Text>
                            </View>
                            <View style={styles.row}>
                                <Image source={require('../../images/medicine/grey_ingr.png')} style={styles.icon} />
                                <Text style={styles.cautionText}>은 신장에 직접적인 큰 부담을 주지는 않는 성분이지만 주의하세요.</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default MedicineScreen;
