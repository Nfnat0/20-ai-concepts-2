/* script.js - Navigation, Scroll-monitoring, and Layout Manager */

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let activeIndex = 0; // 0 = Overview (Concept 0)
  const totalConcepts = 20;
  let isMobile = window.innerWidth < 767;

  // DOM Elements
  const cards = document.querySelectorAll('.concept-card');
  const tocItems = document.querySelectorAll('.toc-item');
  const progressBar = document.querySelector('.header-progress-bar');
  const progressText = document.querySelector('.header-progress-text');
  
  // Navigation elements
  const prevBtn = document.querySelector('.pc-nav-btn.prev');
  const nextBtn = document.querySelector('.pc-nav-btn.next');
  
  // Mobile UI elements
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileOverlay = document.querySelector('.mobile-toc-overlay');
  const mobileActiveTitle = document.querySelector('.mobile-active-title');
  const mobileActiveIndex = document.querySelector('.mobile-active-index');

  // Technical Quiz Data (Non-metaphorical, focused on specifications/math)
  const quizData = {
    1: [
      {
        q: "ニューラルネットワークの学習（トレーニング）における「バックプロパゲーション（誤差逆伝播法）」の主な役割は何か？",
        options: [
          { text: "各ニューロンの活性化関数を動的に変更する。", correct: false },
          { text: "出力層の誤差から各層の重みに関する損失関数の勾配を計算し、重みを更新する。", correct: true },
          { text: "入力データの次元を削減して処理を高速化する。", correct: false }
        ],
        explanation: "バックプロパゲーションは、ネットワークの出力と正解値の誤差を逆方向に伝播させ、微分係数の連鎖律（チェーンルール）を用いて各重みパラメータに対する損失関数の勾配を効率的に求め、最適化アルゴリズム（SGDやAdamなど）によって重みを更新する基礎手法です。"
      },
      {
        q: "活性化関数（ReLUやSigmoidなど）をニューラルネットワークに導入する主な目的は何か？",
        options: [
          { text: "ネットワークの計算をすべて線形（足し算と掛け算のみ）にするため。", correct: false },
          { text: "出力結果を必ず0から1の範囲に正規化するため。", correct: false },
          { text: "ネットワークに非線形性を導入し、複雑な境界線やパターンを表現可能にするため。", correct: true }
        ],
        explanation: "線形変換の重ね合わせは単一の線形変換にすぎないため、非線形な活性化関数を通さないと、ネットワークを何層重ねても単純な線形モデルと同等の表現力しか持てません。非線形性を導入することで、任意の複雑な関数を近似できるようになります（万能近似定理）。"
      }
    ],
    2: [
      {
        q: "BPE (Byte Pair Encoding) などのサブワード・トークナイザが、単語単位のトークン化と比較して優れている技術的理由は何か？",
        options: [
          { text: "辞書サイズ（語彙数）を一定以下に抑えつつ、未知語（OOV）の発生を完全に防ぐことができる。", correct: true },
          { text: "すべてのトークンのバイト長を完全に均一に揃えることができる。", correct: false },
          { text: "文法構造を解析して、名詞や動詞を自動的に分類できる。", correct: false }
        ],
        explanation: "BPEは、頻出する文字ペアを繰り返し結合してサブワード辞書を構築します。これにより、頻出単語は1トークンとして扱い、珍しい単語や未知語は最小単位（文字など）に分解して処理できるため、限られた語彙サイズで未知語（Out-of-Vocabulary）問題を回避できます。"
      },
      {
        q: "日本語のテキストをトークン化する際、英語に比べてトークン数が多く消費されやすい（いわゆる「トークン貧乏」）主な原因は何か？",
        options: [
          { text: "日本語の文字はバイト数が多く、トークナイザが文字単位またはそれ以下のバイト単位で細かく分割することが多いため。", correct: true },
          { text: "日本語にはスペースによる分かち書きが存在しないため、トークナイザが常に1文全体を1トークンとして処理するから。", correct: false },
          { text: "日本語の活性化関数が英語と異なるため。", correct: false }
        ],
        explanation: "GPTなどのマルチリンガル対応トークナイザはUTF-8バイトベースの辞書を使用していることが多く、英語が単語に近い粒度で1トークンになるのに対し、日本語は文字数が多く、かつ1文字が3バイト消費されるため、バイト単位で細切れ（文字未満の単位に分割）になりやすく、トークン消費量が増大します。"
      }
    ],
    3: [
      {
        q: "埋め込み表現において、2つのベクトル（トークン）の意味的な類似度を評価する際、一般的に最もよく使われる数学的指標はどれか？",
        options: [
          { text: "ベクトルのユークリッド距離の総和。", correct: false },
          { text: "2つのベクトルの内積をそれぞれのノルムの積で割った「コサイン類似度」。", correct: true },
          { text: "各ベクトル次元の平均値の差分。", correct: false }
        ],
        explanation: "コサイン類似度は、多次元空間上の2つのベクトルのなす角のコサイン値であり、ベクトルの大きさ（スケール）に依存せず、向きの類似性を測るのに適しているため、テキスト埋め込みベクトルの類似度算出に広く採用されています。"
      },
      {
        q: "トランスフォーマーの入力部で行われる「Positional Encoding（位置符号化）」の役割は何か？",
        options: [
          { text: "トークンが文中のどの位置にあるかという順序情報を、トークン埋め込みベクトルに加算して位置情報を与える。", correct: true },
          { text: "トークンの出現頻度をカウントして重み付けする。", correct: false },
          { text: "埋め込みベクトルの次元数を削減する。", correct: false }
        ],
        explanation: "トランスフォーマーはアテンション機構によって文中の全トークンを同時に並列処理するため、時系列の順序情報が失われます。そこで、位置に応じた周期の異なる正弦波・余弦波（または学習可能なベクトル）を元の埋め込みベクトルに足し合わせることで、順序情報をネットワークに伝達します。"
      }
    ],
    4: [
      {
        q: "Self-Attention（自己注目機構）において、入力トークンベクトルから線形変換で生成される3つのベクトル（Query, Key, Value）のうち、アテンション重み（注目度スコア）を決定するために内積を計算する組み合わせはどれか？",
        options: [
          { text: "Query と Value", correct: false },
          { text: "Key と Value", correct: false },
          { text: "Query と Key", correct: true }
        ],
        explanation: "アテンションスコアは、各トークンが持つ「問い合わせ（Query）」ベクトルと、他のすべてのトークンが持つ「インデックス情報（Key）」ベクトルの内積を計算することで、トークン間の関連性の強さを求めます。このスコアにSoftmaxを適用した重みを「コンテンツ（Value）」ベクトルに乗算します。"
      },
      {
        q: "Scaled Dot-Product Attention において、Query と Key の内積をベクトルの次元数 d_k の平方根で割る（スケーリングする）技術的な理由は何か？",
        options: [
          { text: "次元数が大きくなると内積の値が極端に大きくなり、Softmax 関数の勾配が極端に小さくなる（勾配消失）のを防ぐため。", correct: true },
          { text: "ベクトルの次元数を強制的に1次元に圧縮するため。", correct: false },
          { text: "アテンション行列のすべての値を正の整数に変換するため。", correct: false }
        ],
        explanation: "ベクトルの次元数 d_k が大きくなると、各要素が独立だと仮定した場合、内積の分散が d_k に比例して大きくなります。これにより内積が非常に大きな値になり、Softmax関数が極端に平坦な領域（確率が1付近または0付近）に達してしまい、誤差逆伝播時の勾配がほぼゼロになる「勾配消失」を招くため、平方根で割ってスケーリングします。"
      }
    ],
    5: [
      {
        q: "トランスフォーマーがRNN（再帰型ニューラルネットワーク）と比較して、巨大なデータセットで劇的に高速に学習できるアーキテクチャ上の最大の理由は何か？",
        options: [
          { text: "再帰処理（時系列順の逐次処理）を排除し、文全体のトークンをアテンション機構によって並列に処理できるため。", correct: true },
          { text: "重みの数をRNNよりも大幅に減らしているため。", correct: false },
          { text: "浮動小数点数の計算をすべて整数計算に置き換えているため。", correct: false }
        ],
        explanation: "RNNは前のタイムステップの出力を順次入力するため、並列化が不可能でした。トランスフォーマーは再帰を一切排除し、アテンションを用いて文全体を1回で並列計算できるため、GPUの処理効率を極限まで高めることが可能になり、大規模学習を実現しました。"
      },
      {
        q: "トランスフォーマーの各ブロックに存在する「残差接続（Residual Connection / Skip Connection）」の主な役割は何か？",
        options: [
          { text: "不要なトークンを自動的にスキップして処理速度を上げる。", correct: false },
          { text: "層が深くなったときに勾配が途切れず伝播するようにし、勾配消失を防ぐ。", correct: true },
          { text: "アテンションの出力をゼロにリセットする。", correct: false }
        ],
        explanation: "残差接続は、入力 x をアテンション層の出力 F(x) と足し合わせて F(x) + x とし、情報をバイパスさせます。これにより、多層（数十〜数百層）になってもバックプロパゲーション時の勾配が直接前方の層へと流れ、ディープモデルに特有の勾配消失問題を劇的に抑制します。"
      }
    ],
    6: [
      {
        q: "一般的なデコーダー専用（Decoder-only）のLLM（GPTシリーズなど）が推論時に使用する、自身が以前に出力したトークンを次の入力として再利用する処理の名称は何か？",
        options: [
          { text: "非同期並列処理（Asynchronous Processing）", correct: false },
          { text: "自己回帰（Autoregressive）生成", correct: true },
          { text: "双方向マスクアテンション（Bi-directional Masked Attention）", correct: false }
        ],
        explanation: "自己回帰（Autoregressive）モデルは、文頭のプロンプトからスタートし、「一度に1つのトークンを予測・出力」し、その出力されたトークンを履歴（コンテキスト）に付け足して次のトークンを入力として予測するステップを、終了トークン（EOS）が出るまで逐次繰り返します。"
      },
      {
        q: "LLMの事前学習（Pre-training）における損失関数（Loss Function）として一般的に使用されるのはどれか？",
        options: [
          { text: "平均二乗誤差（MSE Loss）", correct: false },
          { text: "クロスエントロピー誤差（Cross-Entropy Loss）", correct: true },
          { text: "ヒンジ損失（Hinge Loss）", correct: false }
        ],
        explanation: "LLMのタスクは、ボキャブラリーサイズ（数万〜数十万トークン）の多クラス分類問題です。したがって、モデルの予測確率分布とグラウンドトゥルース（実際のテキストの単語）との差異を測定する多クラスの「クロスエントロピー損失」を最小化するように学習します。"
      }
    ],
    7: [
      {
        q: "LLM의 コンテキストウィンドウを物理的に制限している最大の計算資源上のボトルネックは何か？",
        options: [
          { text: "標準的なアテンション機構において、入力トークン長 N に対して計算量とメモリ消費量が O(N^2) の二乗比例で増加するため。", correct: true },
          { text: "ハードディスクの書き込み速度が追いつかないため。", correct: false },
          { text: "インターネットの通信速度が制限されているため。", correct: false }
        ],
        explanation: "フルアテンション（Full Attention）では、すべてのトークンが互いに注目し合うため、N×N のアテンション行列を保持・計算する必要があります。トークン数が倍になると必要な計算量とKVキャッシュなどのGPUメモリは4倍に膨れ上がり、これが長文脈化を阻む物理限界となっています。"
      },
      {
        q: "コンテキストウィンドウの上限を超えた長文を入力した際、モデルの挙動として正しいものはどれか？",
        options: [
          { text: "自動的にサーバーがシャットダウンする。", correct: false },
          { text: "ウィンドウサイズを超えた古いトークン情報がアテンションの計算対象から外れ、文脈を保持できなくなる。", correct: true },
          { text: "自動的にモデルのパラメータ数が増大して処理を継続する。", correct: false }
        ],
        explanation: "アテンション機構は一度に計算できるトークン幅（コンテキスト窓）の最大値が固定されています。窓を超える入力があると、窓からはみ出た最古のトークンはアテンションの計算窓（KVキャッシュ等）から切り捨てられるか、そもそも入力エラーになり処理できなくなります。"
      }
    ],
    8: [
      {
        q: "サンプリング時の Temperature（温度パラメータ）を極限まで低く（例: 0に近く）設定した場合、LLMの出力トークンの選択ロジックはどうなるか？",
        options: [
          { text: "常に最も確率（ロジット）が高いトークンが選択される（貪欲法）。", correct: true },
          { text: "すべてのトークンが完全に等確率でランダムに選択される。", correct: false },
          { text: "トークン化の処理がバイパスされる。", correct: false }
        ],
        explanation: "温度 T を低くすると、Softmax適用前のロジットが W/T によって拡大され、最大確率を持つトークンの選択確率が極端に1に近づきます。結果として、ランダム性が排除され、常に最も確率の高いトークンのみを選択する貪欲法（Greedy Search）と同等の出力になります。"
      },
      {
        q: "Temperature パラメータが適用されるのは、LLMのどの計算段階か？",
        options: [
          { text: "入力直後の埋め込み（Embedding）レイヤー", correct: false },
          { text: "最終層の出力ロジット（Logits）に Softmax を適用して確率分布を計算する段階", correct: true },
          { text: "アテンション層の Query と Key の積を求める段階", correct: false }
        ],
        explanation: "LLMの出力層は、全単語に対応する生のスコア（ロジット）を出力します。このロジットを温度 T で除算（Logits / T）した上で Softmax 関数に通し、最終的なサンプリング用確率分布を得ます。温度は出力確率の尖り度合いを制御するフィルタの役目を持っています。"
      }
    ],
    9: [
      {
        q: "ハルシネーション（もっともらしい嘘）が発生する根本的な技術的背景は何か？",
        options: [
          { text: "LLMは事実の正誤を判定するデータベースではなく、統計的なトークンの接続確率に基づいて文章を生成する仕組みだから。", correct: true },
          { text: "LLM의 学習データにプログラムのバグが含まれているから。", correct: false },
          { text: "モデルの量子化によってすべての数値データが破壊されたから。", correct: false }
        ],
        explanation: "LLMは意味表現や文字の「次に来る確率の分布」を学習した言語生成器であり、データベースのように「外部の事実」を裏付けるファクトチェックモジュールを持ちません。そのため、文脈的に最も自然に聞こえる文言を生成した結果、事実と異なる文章になります。"
      },
      {
        q: "ハルシネーションを技術的に抑制するための有効な手法（グラウンディング）として最も適切なものはどれか？",
        options: [
          { text: "温度（Temperature）を可能な限り高く設定する。", correct: false },
          { text: "RAG等を用いて、信頼できる外部知識から取得した正確なコンテキストをプロンプトに注入する。", correct: true },
          { text: "コンテキストウィンドウのサイズを極端に小さくする。", correct: false }
        ],
        explanation: "グラウンディング（事実の裏付け）には、モデルの外部から取得した確かなコンテキストをプロンプトに持たせる手法が有効です。これにより、LLMはモデル自身の曖昧な記憶（パラメータ）ではなく、与えられた入力文脈という「正確なテキストソース」から情報を抽出して応答を組み立てます。"
      }
    ],
    10: [
      {
        q: "Few-Shot プロンプティング（いくつかの具体例を提示する手法）が、事前学習済みモデルの重みを変更せずにタスクの適応力を高めることができる仕組みを、学術的に何と呼ぶか？",
        options: [
          { text: "インコンテキスト学習（In-Context Learning）", correct: true },
          { text: "事後ファインチューニング（Post-Fine-tuning）", correct: false },
          { text: "パラメータ効率的学習（PEFT）", correct: false }
        ],
        explanation: "インコンテキスト学習は、プロンプトのコンテキスト内に含まれるパターンや指示に対して、モデルのアテンション機構が動的に反応し、その入力コンテキストの文理に沿って次の応答を生成するトランスフォーマー固有の性質（創発能力の1つ）です。重みの書き換えは一切起きません。"
      },
      {
        q: "プロンプト内で「ステップバイステップで考えてください」と指示する（Chain of Thought）ことで、論理推論の精度が向上する技術的理由は何か？",
        options: [
          { text: "中間推論ステップをトークンとして明示的に出力させることで、アテンションが過去の推論プロセスを参照しながら次の計算を行えるようになるため。", correct: true },
          { text: "モデルのパラメータ数を一時的に増やしているため。", correct: false },
          { text: "トークンのデコード速度が低下して、GPUの計算がより緻密になるため。", correct: false }
        ],
        explanation: "LLMは次の1トークンを出力するために一定の計算を挟みますが、複雑な数学問題に直接答え（数値）だけを出力させようとすると計算が追いつきません。思考プロセスを段階的に「文字として出力」させることで、自身が出力した過去の中間結果（トークン）をKey/Valueとしてアテンションで参照でき、順を追った論理的な計算が成立します。"
      }
    ],
    11: [
      {
        q: "転移学習において、すでに大量のデータで学習されたモデルのパラメータ（重み）を新しいタスクに適応させるために、学習済みの重みを初期値として再学習するプロセスを何と呼ぶか？",
        options: [
          { text: "事前学習（Pre-training）", correct: false },
          { text: "ファインチューニング（Fine-Tuning）", correct: true },
          { text: "蒸留（Distillation）", correct: false }
        ],
        explanation: "ファインチューニングは、膨大なコーパスで汎用的な言語特徴を掴んだ「事前学習済みモデル」の全パラメータまたは一部を初期値とし、ターゲットの少数データセットを用いてさらに学習（勾配更新）を行い、特定のタスクに適応させるプロセスです。"
      },
      {
        q: "下流タスク向けにモデルを転移学習させる際、学習済みの特徴抽出用レイヤーの重みを変更せず、最終出力レイヤーのみを学習することを何と呼ぶか？",
        options: [
          { text: "フルパラメータ更新（Full parameter updates）", correct: false },
          { text: "特徴抽出（Feature Extraction）または特徴量の固定（Freezing）", correct: true },
          { text: "量子化（Quantization）", correct: false }
        ],
        explanation: "元のネットワーク（特徴抽出部）の重みをフリーズ（更新禁止）し、その出力（特徴ベクトル）を入力とするシンプルな線形分類層などを最後尾に追加してそこだけを学習する手法です。計算資源が極めて少なくて済み、過学習を防ぐ効果があります。"
      }
    ],
    12: [
      {
        q: "「フルファインチューニング」を実行する際の最大のデメリットは何か？",
        options: [
          { text: "すべてのパラメータの勾配を計算して更新するため、莫大な計算資源（GPUメモリ）と時間がかかる。", correct: true },
          { text: "新しいデータを全く学習できない。", correct: false },
          { text: "モデルのトークンウィンドウサイズが半分に減少する。", correct: false }
        ],
        explanation: "モデル全体のパラメータ（数億〜数千億個）に対して勾配を逆伝播し、最適化状態（Adamのモーメンタムなど）を保持する必要があるため、パラメータ数の数倍〜十数倍に及ぶ莫大なGPUメモリを消費します。これが大規模モデルにおける最大のインフラ上の課題です。"
      },
      {
        q: "ファインチューニングによって新しいタスクやドメインを学習させた際、モデルが以前に持っていた一般的な知識や別のタスクの能力を喪失してしまう現象を何と呼ぶか？",
        options: [
          { text: "過学習（Overfitting）", correct: false },
          { text: "破滅的忘却（Catastrophic Forgetting）", correct: true },
          { text: "勾配爆発（Gradient Explosion）", correct: false }
        ],
        explanation: "破滅的忘却は、新しい特定のデータセットにモデルの重みが引きずられて最適化されすぎた結果、事前学習で構築された汎用的な知識ベースが上書き・破壊されてしまい、元の無関係なタスク（対話、翻訳など）の性能が著しく劣化する現象です。"
      }
    ],
    13: [
      {
        q: "RLHF（人間のフィードバックによる強化学習）において、人間の好みに合う出力を評価するために、プロンプトに対する複数の応答候補のスコアを予測するモデルを何と呼ぶか？",
        options: [
          { text: "報酬モデル（Reward Model）", correct: true },
          { text: "アクターモデル（Actor Model）", correct: false },
          { text: "ポリシーモデル（Policy Model）", correct: false }
        ],
        explanation: "RLHFではまず、同じプロンプトに対してモデルが生成した複数の応答を人間（またはAI）が評価し、どの出力が優れているかランク付けします。このランキングデータを学習し、応答の良さを「スカラー値（スコア）」として出力するニューラルネットワークが「報酬モデル」です。"
      },
      {
        q: "強化学習アルゴリズムでポリシーモデル（LLM）を更新する際、元の事前学習モデルから極端に出力が乖離して崩壊するのを防ぐために、損失関数に導入されるペナルティ項は何か？",
        options: [
          { text: "L2正則化項", correct: false },
          { text: "KLダイバージェンス（カルバック・ライブラー情報量）ペナルティ", correct: true },
          { text: "平均絶対誤差（MAE）", correct: false }
        ],
        explanation: "ポリシー（LLMの生成確率分布）が強化学習の更新過程で元のリファレンスモデルから離れすぎると、報酬モデルの裏をかくハック（意味不明だが報酬スコアだけが高いテキストを吐く）が起きてモデルが崩壊します。これを防ぐため、2つの確率分布の距離を示すKLダイバージェンスをペナルティ項として損失関数に加算し、乖離を制限します。"
      }
    ],
    14: [
      {
        q: "LoRA (Low-Rank Adaptation) の基本的な数理的アプローチは何か？",
        options: [
          { text: "元の重み行列 W_0 を直接更新せず、差分行列 ΔW を2つの低ランク行列 A と B （ΔW = B \u00d7 A）に分解して学習する。", correct: true },
          { text: "モデルの活性化関数をすべて線形近似する。", correct: false },
          { text: "パラメータのビット数を16ビットから4ビットに削減する。", correct: false }
        ],
        explanation: "LoRAは、重みの更新差分 ΔW が実質的に「低い固有階数（低ランク）」に収まるという仮定に基づきます。サイズが d\u00d7k の重み行列に対し、d\u00d7r の行列 B と r\u00d7k の行列 A (r \u226a d, k) を導入し、W = W_0 + B\u00d7A として A と B のみを学習することで、更新パラメータ数を数千分の一に削減します。"
      },
      {
        q: "元の重み行列のサイズが d \u00d7 k のとき、LoRAのランクを r (r \u226a d, k) とすると、更新用パラメータ数はどのように削減されるか？",
        options: [
          { text: "(d + k) \u00d7 r に削減される。", correct: true },
          { text: "(d \u00d7 k) / r に削減される。", correct: false },
          { text: "r^2 に固定される。", correct: false }
        ],
        explanation: "元のパラメータ数は d \u00d7 k 個です。LoRAでは B (d \u00d7 r) と A (r \u00d7 k) を掛け合わせて近似するため、学習するパラメータは両方の行列の要素数の合計である (d \u00d7 r) + (r \u00d7 k) \uff1d (d + k) \u00d7 r になります。例えば d=4096, k=4096, r=8 の場合、約1600万個からわずか6.5万個へと激減します。"
      }
    ],
    15: [
      {
        q: "LLMの量子化において、32ビット浮動小数点数（FP32）から、数値をより少ないビット幅（INT8やINT4）に変換する際、精度の損失を最小限に抑えるために各数値レンジをスケーリングするパラメータは何か？",
        options: [
          { text: "活性化係数（Activation Factor）", correct: false },
          { text: "スケールファクタ（Scale Factor）とゼロポイント（Zero Point）", correct: true },
          { text: "勾配クリッピング閾値", correct: false }
        ],
        explanation: "浮動小数点数を整数値にマッピングする際、元の最小・最大値の範囲（クリッピング範囲）を整数のビット表現幅（INT8なら-128〜127）に引き伸ばすための「縮尺（スケール）」と、実数の0が整数のどこに対応するかをシフトさせる「オフセット（ゼロポイント）」を算出して計算に用います。"
      },
      {
        q: "量子化技術の1つである「AWQ」や「GPTQ」の主な目的は何か？",
        options: [
          { text: "重要な「外れ値（Outliers）」の重み情報を維持しつつ、低ビット化による推論時の精度劣化を最小限に抑えること。", correct: true },
          { text: "トークン化の処理速度を10倍に高速化すること。", correct: false },
          { text: "ニューラルネットワークの層数を削減すること。", correct: false }
        ],
        explanation: "LLMのパラメータには、モデルの出力に極めて重大な影響を与える「外れ値（極端に大きい数値）」が含まれています。AWQ (Activation-aware Weight Quantization) や GPTQ などは、活性化（推論時の各ニューロンの動き）を考慮して、これら重要なパラメータを保護・補正しながら量子化を行うため、4ビット以下まで圧縮しても実用的な精度を維持できます。"
      }
    ],
    16: [
      {
        q: "RAG（検索拡張生成）システムにおいて、外部文書をあらかじめ一定 of トークン単位に分割してベクトルデータベースに登録する処理を何と呼ぶか？",
        options: [
          { text: "チャンキング（Chunking）", correct: true },
          { text: "量子化（Quantization）", correct: false },
          { text: "トークンエンコーディング", correct: false }
        ],
        explanation: "長大な文書を一括でベクトル変換すると、全体が平均化されて特定の重要トピックが埋もれてしまいます。そのため、数十字〜数百字程度の適切な意味的区切り（チャンク）に細分化してそれぞれをベクトル表現化する「チャンキング」処理が必須となります。"
      },
      {
        q: "RAGシステムでユーザーのクエリに対して関連する文書を検索する際、ベクトル検索の性能（ノイズの混入）を改善するために検索後に不要なドキュメントを絞り込む手法はどれか？",
        options: [
          { text: "トークナイズ", correct: false },
          { text: "リランキング（Reranking）", correct: true },
          { text: "バックプロパゲーション", correct: false }
        ],
        explanation: "ベクトル検索（第一段階）は高速ですが精度が粗いため、関連度の低いノイズを上位に拾うことがあります。そこで、検索された上位数十件の候補に対し、クロスエンコーダ等の高性能な「リランカー」モデルを用いてクエリとの直接的な相互関連スコアを再計算し、高精度に並び替える「リランキング」が有効です。"
      }
    ],
    17: [
      {
        q: "ベクトルデータベースで数百万件以上の高次元ベクトルから高速に近似的な類似ベクトルを見つけ出すために使われる主要なアルゴリズム/インデックス構造はどれか？",
        options: [
          { text: "HNSW (Hierarchical Navigable Small World)", correct: true },
          { text: "B+木 (B-Plus Tree)", correct: false },
          { text: "赤黒木 (Red-Black Tree)", correct: false }
        ],
        explanation: "高次元空間の全探索は計算量が膨大になるため、近似最近傍探索（ANN）が用いられます。HNSWは、高次元のデータ点を多層のグラフ（スモールワールド・ネットワーク）としてリンクし、上の高速道路のようなレイヤーから下の一般道のようなレイヤーへと段階的に探索を進めることで、対数時間 O(log N) の超高速な類似度検索を実現します。"
      },
      {
        q: "ベクトルデータベースにデータを登録する前に、まず適用しなければならない前処理は何か？",
        options: [
          { text: "テキストを埋め込みモデル（Embedding Model）に通してベクトル（数値配列）に変換する。", correct: true },
          { text: "テキストを完全に暗号化する。", correct: false },
          { text: "テキストから名詞だけを抽出してCSVに保存する。", correct: false }
        ],
        explanation: "ベクトルデータベースは数値配列間の幾何学的距離を計算するシステムです。そのため、入力されたテキスト情報を、多次元空間上の意味的位置を示す固定次元の埋め込みベクトル（例: FP32が1536個並んだ配列）に事前に変換しておく必要があります。"
      }
    ],
    18: [
      {
        q: "AIエージェントが自律的に目標を達成するループ構造（ReActフレームワークなど）において、コアとなる3つの基本プロセスはどれか？",
        options: [
          { text: "思考（Thought）、行動（Action）、観察（Observation）", correct: true },
          { text: "学習（Learn）、量子化（Quantize）、推論（Infer）", correct: false },
          { text: "埋め込み（Embed）、検索（Search）、生成（Generate）", correct: false }
        ],
        explanation: "ReActは、LLMに推論プロセス（Thought）をテキスト出力させ、必要な外部ツール実行（Action）を決定・実行し、そのツールからの戻り値（Observation）を次の入力コンテキストとして取り込むループを回すことで、自律的な問題解決を可能にする代表的なエージェントフレームワークです。"
      },
      {
        q: "AIエージェントが外部ツール（Web検索、計算機、APIなど）を実行する際、どのような仕組みで実行が決定されるか？",
        options: [
          { text: "エージェントのLLMが「ツール名と実行用引数」を出力し、それをシステム側が解析して呼び出す。", correct: true },
          { text: "LLM自身が直接オペレーティングシステムにアクセスしてバイナリを実行する。", correct: false },
          { text: "あらかじめ決まった固定の順番で必ずすべてのツールを順次実行する。", correct: false }
        ],
        explanation: "LLM自体はコードの実行やHTTP通信を行えません。LLMが利用可能なツールの定義（関数名、引数仕様のJSONスキーマなど）をプロンプトで受け取り、次にどのツールを呼ぶべきか指示するテキスト（またはTool Callレスポンス）を生成します。それを監視しているラッパープログラム（Python実行環境など）が実際の関数を実行し、結果を再びLLMに戻します。"
      }
    ],
    19: [
      {
        q: "Chain of Thought (CoT) の派生手法であり、複数の異なる推論パス（思考の枝）を生成し、それぞれのパスを評価しながら最適な結論へと探索を進める手法を何と呼ぶか？",
        options: [
          { text: "Self-Consistency", correct: false },
          { text: "Tree of Thoughts (ToT)", correct: true },
          { text: "Graph of Thoughts (GoT)", correct: false }
        ],
        explanation: "Tree of Thoughtsは、推論プロセスを複数の「思考のステップ（ノード）」に分割し、探索木（Tree）のように複数の分岐パスを生成します。さらに、各ステップで進捗を自己評価し、深さ優先探索（DFS）や幅優先探索（BFS）などの探索アルリズムを併用してバックトラック（引き返し）を行いながら最適解を探索する手法です。"
      },
      {
        q: "Zero-shot CoT を実行する際に、プロンプトの末尾に記述する最も有名な魔法のフレーズはどれか？",
        options: [
          { text: "「正確に答えてください」", correct: false },
          { text: "「ステップバイステップで順を追って考えてみましょう」", correct: true },
          { text: "「あなたは世界最高水準のAIです」", correct: false }
        ],
        explanation: "Kojimaら（2022年）の発見により、プロンプトの最後に「Let's think step by step（順を追って考えてみましょう）」と記述するだけで、事前学習モデルはCoT推論を実行するように促され、多肢選択問題や数学演算、記号処理タスクの精度が劇的に向上することが実証されました。"
      }
    ],
    20: [
      {
        q: "拡散モデルによる画像生成において、画像に徐々にノイズを加える過程を「順方向拡散」と呼ぶのに対し、ノイズから元の画像を段階的に復元していく過程を何と呼ぶか？",
        options: [
          { text: "逆方向拡散過程（またはデノイジング）", correct: true },
          { text: "バックプロパゲーション", correct: false },
          { text: "埋め込み空間への投影", correct: false }
        ],
        explanation: "拡散モデルの学習は、元の画像にガウスノイズを段階的に付加して完全なノイズにする「順方向」と、その逆に「ノイズから1ステップ前の画像に戻すためのノイズ予測（スコア予測）」を行う「逆方向（Reverse Process / Denoising）」をU-Net等で学習し、最終的にランダムノイズから新規の画像を生成可能にします。"
      },
      {
        q: "拡散モデルのデノイジング過程において、各ステップで画像からノイズを予測するために一般的に用いられるニューラルネットワークのアーキテクチャはどれか？",
        options: [
          { text: "U-Net", correct: true },
          { text: "Transformer (Attention-only)", correct: false },
          { text: "MLP (Multi-Layer Perceptron)", correct: false }
        ],
        explanation: "デノイジングで使用される U-Net は、画像をエンコーダで一度圧縮（ダウンサンプリング）しながら特徴量を抽出し、デコーダで同じ解像度に復元（アップサンプリング）する対称構造を持ちます。また、ディテール情報を維持するためにエンコーダとデコーダの同じ解像度同士を結ぶ「スキップ接続」を持つため、精密な画像ノイズ予測に適しています。"
      }
    ]
  };

  // Initialize page view state & Quizzes
  initializeQuizzes();
  handleResize();
  updateView();

  // Listeners
  window.addEventListener('resize', handleResize);
  
  // PC Nav Button click handlers
  if (prevBtn) prevBtn.addEventListener('click', navigatePrev);
  if (nextBtn) nextBtn.addEventListener('click', navigateNext);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (isMobile) return; // Disable keyboard pagination on mobile vertical scroll
    if (e.key === 'ArrowLeft') {
      navigatePrev();
    } else if (e.key === 'ArrowRight') {
      navigateNext();
    }
  });

  // TOC Item Click handler (both desktop sidebar and mobile overlay)
  tocItems.forEach((item) => {
    const btn = item.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const targetIndex = parseInt(item.getAttribute('data-index'), 10);
      if (isNaN(targetIndex)) return;
      
      if (isMobile) {
        // Mobile behavior: scroll target card into view (offset managed by scroll-margin-top in CSS)
        closeMobileOverlay();
        const targetCard = document.getElementById(`concept-${targetIndex}`);
        if (targetCard) {
          targetCard.scrollIntoView({
            behavior: 'smooth'
          });
        }
      } else {
        // Desktop behavior: change active tab
        activeIndex = targetIndex;
        updateView();
      }
    });
  });

  // Card Footer Navigation Click handler
  const footerNavItems = document.querySelectorAll('.footer-nav-item');
  footerNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetIndex = parseInt(item.getAttribute('data-target'), 10);
      if (isNaN(targetIndex) || targetIndex < 0 || targetIndex > totalConcepts) return;
      
      if (isMobile) {
        // Mobile behavior: scroll target card into view (offset managed by scroll-margin-top in CSS)
        const targetCard = document.getElementById(`concept-${targetIndex}`);
        if (targetCard) {
          targetCard.scrollIntoView({
            behavior: 'smooth'
          });
        }
      } else {
        // Desktop behavior: change active tab
        activeIndex = targetIndex;
        updateView();
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('show')) {
        closeMobileOverlay();
      } else {
        openMobileOverlay();
      }
    });
  }

  // Close mobile overlay when clicking outside the menu items
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        closeMobileOverlay();
      }
    });
  }

  // Navigation Logic functions
  function navigatePrev() {
    if (activeIndex > 0) {
      activeIndex--;
      updateView();
    }
  }

  function navigateNext() {
    if (activeIndex < totalConcepts) {
      activeIndex++;
      updateView();
    }
  }

  function openMobileOverlay() {
    mobileOverlay.classList.add('show');
    mobileToggle.textContent = '閉じる';
    document.body.style.overflow = 'hidden'; // Disable page scrolling while TOC is open
  }

  function closeMobileOverlay() {
    mobileOverlay.classList.remove('show');
    mobileToggle.textContent = '目次';
    document.body.style.overflow = ''; // Re-enable scroll
  }

  // Update visual elements
  function updateView() {
    // 1. Update Card Visibility (PC Mode)
    if (!isMobile) {
      cards.forEach((card, idx) => {
        if (idx === activeIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
      
      // Keep scroll state clean on card change
      window.scrollTo(0, 0);
    }

    // 2. Highlight Table of Contents (both PC & mobile lists, fixed item-matching bug)
    tocItems.forEach((item) => {
      const itemIndex = parseInt(item.getAttribute('data-index'), 10);
      if (itemIndex === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 3. Update Progress Bar & Info Text
    const pct = (activeIndex / totalConcepts) * 100;
    progressBar.style.width = `${pct}%`;
    
    if (activeIndex === 0) {
      progressText.textContent = `はじめに`;
      if (mobileActiveIndex) mobileActiveIndex.textContent = `INTRO`;
      if (mobileActiveTitle) mobileActiveTitle.textContent = `概要と目次`;
    } else {
      progressText.textContent = `進捗: ${activeIndex} / ${totalConcepts}`;
      if (mobileActiveIndex) mobileActiveIndex.textContent = `${activeIndex}/${totalConcepts}`;
      
      const currentCard = document.getElementById(`concept-${activeIndex}`);
      if (currentCard) {
        const titleJpEl = currentCard.querySelector('.concept-title-jp');
        if (titleJpEl && mobileActiveTitle) {
          mobileActiveTitle.textContent = titleJpEl.textContent;
        }
      }
    }

    // 4. Update PC Nav Buttons visibility
    if (prevBtn && nextBtn) {
      if (activeIndex === 0) {
        prevBtn.style.visibility = 'hidden';
      } else {
        prevBtn.style.visibility = 'visible';
      }

      if (activeIndex === totalConcepts) {
        nextBtn.style.visibility = 'hidden';
      } else {
        nextBtn.style.visibility = 'visible';
      }
    }
  }

  // Resize Handler
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth < 767;

    if (wasMobile !== isMobile) {
      if (isMobile) {
        // Transition to Mobile: Make all cards visible for vertical scroll
        cards.forEach((card) => {
          card.classList.add('active');
        });
        setupMobileIntersectionObserver();
      } else {
        // Transition to PC: Re-apply active card hidden states
        destroyMobileIntersectionObserver();
        updateView();
      }
    } else if (isMobile && !observerInstance) {
      // Setup observer on initial load if starting in mobile mode
      setupMobileIntersectionObserver();
    }
  }

  // Intersection Observer for Mobile Scrolling
  let observerInstance = null;

  function setupMobileIntersectionObserver() {
    if (observerInstance) return;

    try {
      const observerOptions = {
        root: null,
        rootMargin: '-150px 0px -200px 0px', // Safe pixel boundaries for iOS Safari compatibility
        threshold: 0
      };

      observerInstance = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idStr = entry.target.id;
            const index = parseInt(idStr.replace('concept-', ''), 10);
            if (!isNaN(index) && index !== activeIndex) {
              activeIndex = index;
              updateView();
            }
          }
        });
      }, observerOptions);

      cards.forEach((card) => {
        observerInstance.observe(card);
      });
    } catch (e) {
      console.warn("IntersectionObserver failed to initialize: ", e);
      // Fail gracefully: scrolling will still work, and manual TOC jumps will work.
    }
  }

  function destroyMobileIntersectionObserver() {
    if (observerInstance) {
      observerInstance.disconnect();
      observerInstance = null;
    }
  }

  // Helper to scroll to card top nicely
  function scrollToCardTop(cardElement) {
    if (isMobile) {
      cardElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Technical Quiz System Functions
  function initializeQuizzes() {
    Object.keys(quizData).forEach((conceptId) => {
      const card = document.getElementById(`concept-${conceptId}`);
      if (!card) return;

      const quizList = quizData[conceptId];

      // 1. Wrap existing content (except header/footer-nav) in card-content-wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'card-content-wrapper';
      
      const children = Array.from(card.children);
      children.forEach((child) => {
        if (!child.classList.contains('card-header') && !child.classList.contains('card-footer-nav')) {
          wrapper.appendChild(child);
        }
      });
      
      const footerNav = card.querySelector('.card-footer-nav');
      if (footerNav) {
        card.insertBefore(wrapper, footerNav);
      } else {
        card.appendChild(wrapper);
      }

      // 2. Add Tabs (Explanation / Quiz)
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'card-tabs';
      
      const contentTab = document.createElement('button');
      contentTab.className = 'card-tab active';
      contentTab.textContent = '解説';
      contentTab.setAttribute('data-tab', 'content');
      
      const quizTab = document.createElement('button');
      quizTab.className = 'card-tab';
      quizTab.textContent = '理解度テスト';
      quizTab.setAttribute('data-tab', 'quiz');
      
      tabsContainer.appendChild(contentTab);
      tabsContainer.appendChild(quizTab);
      
      const headerEl = card.querySelector('.card-header');
      if (headerEl) {
        headerEl.parentNode.insertBefore(tabsContainer, headerEl.nextSibling);
      } else {
        card.insertBefore(tabsContainer, wrapper);
      }

      contentTab.addEventListener('click', () => {
        contentTab.classList.add('active');
        quizTab.classList.remove('active');
        card.classList.remove('show-quiz');
        scrollToCardTop(card);
      });
      
      quizTab.addEventListener('click', () => {
        quizTab.classList.add('active');
        contentTab.classList.remove('active');
        card.classList.add('show-quiz');
        scrollToCardTop(card);
      });
      
      // 3. Create Quiz Section
      const quizSection = document.createElement('div');
      quizSection.className = 'quiz-section';
      
      const header = document.createElement('h3');
      header.className = 'quiz-section-title';
      header.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        Technical Checkpoint (理解度確認テスト)
      `;
      quizSection.appendChild(header);
      
      const quizContainer = document.createElement('div');
      quizContainer.className = 'quiz-container';
      
      quizList.forEach((quiz, qIdx) => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        
        const questionNum = document.createElement('div');
        questionNum.className = 'quiz-question-num';
        questionNum.textContent = `Question ${qIdx + 1} of 2`;
        quizCard.appendChild(questionNum);
        
        const questionText = document.createElement('div');
        questionText.className = 'quiz-question-text';
        questionText.textContent = quiz.q;
        quizCard.appendChild(questionText);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'quiz-options';
        
        quiz.options.forEach((opt) => {
          const optionBtn = document.createElement('button');
          optionBtn.className = 'quiz-option';
          optionBtn.textContent = opt.text;
          optionBtn.setAttribute('data-correct', opt.correct);
          optionBtn.addEventListener('click', () => handleOptionClick(optionBtn, optionsContainer, quizCard, quiz.explanation));
          optionsContainer.appendChild(optionBtn);
        });
        
        quizCard.appendChild(optionsContainer);
        
        const feedback = document.createElement('div');
        feedback.className = 'quiz-feedback';
        quizCard.appendChild(feedback);
        
        quizContainer.appendChild(quizCard);
      });
      
      quizSection.appendChild(quizContainer);
      
      // Insert before footer nav links
      if (footerNav) {
        card.insertBefore(quizSection, footerNav);
      } else {
        card.appendChild(quizSection);
      }
    });
  }

  function handleOptionClick(clickedBtn, optionsContainer, quizCard, explanation) {
    const buttons = optionsContainer.querySelectorAll('.quiz-option');
    const isCorrect = clickedBtn.getAttribute('data-correct') === 'true';
    
    buttons.forEach((btn) => {
      btn.disabled = true;
      const btnCorrect = btn.getAttribute('data-correct') === 'true';
      
      if (btnCorrect) {
        btn.classList.add('correct');
      } else if (btn === clickedBtn) {
        btn.classList.add('incorrect');
      } else {
        btn.classList.add('faded');
      }
    });
    
    const feedback = quizCard.querySelector('.quiz-feedback');
    feedback.innerHTML = `
      <div class="feedback-status ${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          正解!
        ` : `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          不正解
        `}
      </div>
      <div class="feedback-explanation">
        <strong>技術解説:</strong> ${explanation}
      </div>
    `;
    feedback.classList.add('show');
  }
});
