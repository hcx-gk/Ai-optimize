<template>
  <div class="code-optimizer">
    <div class="header">
      <div class="language-switch">
        <el-button-group>
          <el-button 
            :type="currentLang === 'zh' ? 'primary' : ''" 
            size="small" 
            @click="switchLanguage('zh')"
          >中文</el-button>
          <el-button 
            :type="currentLang === 'en' ? 'primary' : ''" 
            size="small" 
            @click="switchLanguage('en')"
          >English</el-button>
        </el-button-group>
      </div>
      <el-tabs v-model="activeTab" class="feature-tabs">
        <el-tab-pane :label="translations[currentLang].tabs.optimization" name="optimization">
          <div class="optimization-settings">
            <el-collapse v-model="activeSettings">
              <!-- 算法优化选项 -->
              <el-collapse-item title="算法优化选项" name="1">
                <el-checkbox-group v-model="algorithmOptions">
                  <el-checkbox label="dynamicProgramming">{{ translations[currentLang].optimization.dynamicProgramming }}</el-checkbox>
                  <el-checkbox label="machineLearn">{{ translations[currentLang].optimization.machineLearn }}</el-checkbox>
                  <el-checkbox label="parallel">{{ translations[currentLang].optimization.parallel }}</el-checkbox>
                  <el-checkbox label="distributed">{{ translations[currentLang].optimization.distributed }}</el-checkbox>
                </el-checkbox-group>
                <div class="optimization-intensity">
                  <span>{{ translations[currentLang].optimization.intensity }}：{{ optimizationIntensity }}%</span>
                  <el-slider v-model="optimizationIntensity" :step="10" show-stops></el-slider>
                </div>
              </el-collapse-item>

              <!-- 安全防御选项 -->
              <el-collapse-item title="安全防御选项" name="2">
                <el-checkbox-group v-model="securityLayers">
                  <el-checkbox label="inputValidation">{{ translations[currentLang].optimization.inputValidation }}</el-checkbox>
                  <el-checkbox label="xssProtection">{{ translations[currentLang].optimization.xssProtection }}</el-checkbox>
                  <el-checkbox label="sqlInjection">{{ translations[currentLang].optimization.sqlInjection }}</el-checkbox>
                  <el-checkbox label="ddosProtection">{{ translations[currentLang].optimization.ddosProtection }}</el-checkbox>
                  <el-checkbox label="encryption">{{ translations[currentLang].optimization.encryption }}</el-checkbox>
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!-- 代码输入和输出区域 -->
          <div class="code-container">
            <div class="code-input">
              <h3>{{ translations[currentLang].optimization.inputCode }}：</h3>
              <el-input
                type="textarea"
                v-model="sourceCode"
                :rows="10"
                :placeholder="translations[currentLang].optimization.placeholder"
              ></el-input>
            </div>
            <div class="action-buttons">
              <el-button 
                type="primary" 
                @click="generateOptimizedCode"
                :loading="loading"
                :disabled="!sourceCode.trim()"
              >
                {{ translations[currentLang].optimization.optimize }}
              </el-button>
              <el-button @click="clearCode">{{ translations[currentLang].optimization.clear }}</el-button>
            </div>
            <div class="code-output" v-if="optimizedCode">
              <h3>{{ translations[currentLang].optimization.optimizedCode }}：</h3>
              <el-input
                type="textarea"
                v-model="optimizedCode"
                :rows="10"
                readonly
              ></el-input>
              <div class="output-actions">
                <el-button type="success" size="small" @click="copyCode">
                  {{ translations[currentLang].optimization.copy }}
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="translations[currentLang].tabs.analysis" name="analysis">
          <div class="analysis-container">
            <!-- 代码输入区域 -->
            <div class="code-input-section">
              <div class="section-header">
                <h3>{{ translations[currentLang].analysis.title }}</h3>
                <p class="section-desc">{{ translations[currentLang].analysis.description }}</p>
              </div>
              <el-input
                type="textarea"
                v-model="analysisCode"
                :rows="10"
                :placeholder="translations[currentLang].analysis.placeholder"
              ></el-input>
              <div class="action-buttons">
                <el-button 
                  type="primary" 
                  @click="analyzeCode"
                  :loading="analyzing"
                  :disabled="!analysisCode.trim()"
                >
                  {{ translations[currentLang].analysis.analyze }}
                </el-button>
                <el-button @click="clearAnalysisCode">{{ translations[currentLang].analysis.clear }}</el-button>
              </div>
            </div>

            <!-- 空状态提示 -->
            <div v-if="!analysisCode && !analysisResults" class="empty-state">
              <i class="el-icon-data-analysis" style="font-size: 64px;"></i>
              <h3>{{ translations[currentLang].analysis.emptyTitle }}</h3>
              <div class="feature-list">
                <div class="feature-item small">
                  <i class="el-icon-medal"></i>
                  <div class="feature-text">
                    <h4>{{ translations[currentLang].analysis.features.quality.title }}</h4>
                    <p>{{ translations[currentLang].analysis.features.quality.desc }}</p>
                  </div>
                </div>
                <div class="feature-item small">
                  <i class="el-icon-warning"></i>
                  <div class="feature-text">
                    <h4>{{ translations[currentLang].analysis.features.security.title }}</h4>
                    <p>{{ translations[currentLang].analysis.features.security.desc }}</p>
                  </div>
                </div>
                <div class="feature-item small">
                  <i class="el-icon-magic-stick"></i>
                  <div class="feature-text">
                    <h4>{{ translations[currentLang].analysis.features.optimization.title }}</h4>
                    <p>{{ translations[currentLang].analysis.features.optimization.desc }}</p>
                  </div>
                </div>
              </div>
              <el-card class="tips-card">
                <div slot="header" class="card-header">
                  <span>{{ translations[currentLang].analysis.tips.title }}</span>
                </div>
                <div class="tips-content">
                  <p><i class="el-icon-info"></i> {{ translations[currentLang].analysis.tips.multiLanguage }}</p>
                  <p><i class="el-icon-info"></i> {{ translations[currentLang].analysis.tips.codeLength }}</p>
                  <p><i class="el-icon-info"></i> {{ translations[currentLang].analysis.tips.reference }}</p>
                </div>
              </el-card>
            </div>

            <!-- 分析结果区域 -->
            <div v-if="analysisResults" class="analysis-results">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card class="chart-card">
                    <div slot="header" class="card-header">
                      <span>{{ translations[currentLang].analysis.charts.quality }}</span>
                    </div>
                    <div ref="qualityChart" style="height: 300px;"></div>
                  </el-card>
                </el-col>
                
                <el-col :span="12">
                  <el-card class="chart-card">
                    <div slot="header" class="card-header">
                      <span>{{ translations[currentLang].analysis.charts.vulnerability }}</span>
                    </div>
                    <div ref="vulnerabilityChart" style="height: 300px;"></div>
                  </el-card>
                </el-col>
              </el-row>

              <el-card class="analysis-report">
                <div slot="header" class="card-header">
                  <span>{{ translations[currentLang].analysis.report.title }}</span>
                  <el-tag :type="getQualityLevelType(analysisResults.overallScore)">
                    {{ translations[currentLang].analysis.report.score }}: {{ analysisResults.overallScore }}
                  </el-tag>
                </div>
                
                <el-table :data="analysisResults.issues" style="width: 100%">
                  <el-table-column prop="severity" label="严重程度" width="100">
                    <template slot-scope="scope">
                      <el-tag :type="getIssueSeverityType(scope.row.severity)">
                        {{ scope.row.severity }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="问题类型" width="150"></el-table-column>
                  <el-table-column prop="description" label="问题描述"></el-table-column>
                  <el-table-column prop="suggestion" label="修复建议"></el-table-column>
                </el-table>
              </el-card>
              <el-card class="analysis-report">
                <div slot="header" class="card-header">
                  <span>{{ translations[currentLang].analysis.report.title }}</span>
                </div>
                <div>
                  <p>框架：{{ analysisResults.detectedTech.frameworks.join(', ') }}</p>
                  <p>语言：{{ analysisResults.detectedTech.languages.join(', ') }}</p>
                </div>
              </el-card>
              <el-card class="framework-detection">
                <div slot="header" class="card-header">
                  <span><i class="el-icon-discover"></i> 技术栈检测结果</span>
                </div>
                <div class="detection-content">
                  <div class="detection-item">
                    <div class="detection-header">
                      <i class="el-icon-cpu"></i>
                      <span>检测到的框架</span>
                    </div>
                    <div class="framework-tags">
                      <el-tag v-for="framework in analysisResults.detectedTech.frameworks" :key="framework" type="success" style="margin: 5px">{{ framework }}</el-tag>
                    </div>
                  </div>
                  <div class="detection-item">
                    <div class="detection-header">
                      <i class="el-icon-notebook-2"></i>
                      <span>编程语言</span>
                    </div>
                    <div class="framework-tags">
                      <el-tag v-for="lang in analysisResults.detectedTech.languages" :key="lang" type="info" style="margin: 5px">{{ lang }}</el-tag>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="translations[currentLang].tabs.project" name="project">
          <div class="project-optimization">
            <div class="tech-background"></div>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-card class="upload-card" shadow="hover">
                  <div class="tech-header">
                    <div class="tech-title">
                      <i class="el-icon-s-help"></i>
                      <span>{{ translations[currentLang].project.title }}</span>
                    </div>
                    <div class="tech-line"></div>
                  </div>
                  
                  <!-- 功能介绍卡片 -->
                  <div class="features-section" v-if="!projectInfo">
                    <el-row :gutter="20">
                      <el-col :span="8" v-for="(feature, index) in features" :key="index">
                        <div class="feature-card" :class="{ 'animate__animated animate__fadeInUp': true }" :style="{ 'animation-delay': index * 0.2 + 's' }">
                          <div class="feature-icon-wrapper">
                            <div class="feature-icon-ring"></div>
                            <i :class="feature.icon"></i>
                          </div>
                          <h3>{{ feature.title }}</h3>
                          <p>{{ feature.description }}</p>
                        </div>
                      </el-col>
                    </el-row>
                    
                    <el-divider>
                      <i class="el-icon-upload"></i>
                      <span style="margin: 0 10px;">{{ translations[currentLang].project.uploadTitle }}</span>
                    </el-divider>
                  </div>

                  <!-- 上传区域 -->
                  <div class="upload-area" :class="{ 'animate__animated animate__fadeIn': true }">
                    <el-upload
                      class="upload-demo"
                      drag
                      action="#"
                      :auto-upload="false"
                      :on-change="handleFileChange"
                      :before-upload="beforeUpload"
                      accept=".zip"
                    >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">
                        <h3>{{ translations[currentLang].project.dragText }}</h3>
                        <p>或 <em>{{ translations[currentLang].project.clickText }}</em></p>
                      </div>
                      <div class="el-upload__tip" slot="tip">
                        <el-alert
                          :title="translations[currentLang].project.fileType"
                          type="info"
                          :closable="false"
                          show-icon>
                        </el-alert>
                      </div>
                    </el-upload>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 优化统计 -->
            <el-row :gutter="20" class="stats-section" v-if="!projectInfo">
              <el-col :span="6" v-for="(stat, index) in statistics" :key="index">
                <div class="stat-card" :class="{ 'animate__animated animate__fadeInUp': true }" :style="{ 'animation-delay': index * 0.1 + 's' }">
                  <div class="stat-icon">
                    <i :class="stat.icon"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- 项目信息和优化进度 -->
            <div v-if="projectInfo" class="project-info-section animate__animated animate__fadeIn">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-card class="info-card tech-card" shadow="hover">
                    <div slot="header" class="tech-card-header">
                      <i class="el-icon-info"></i>
                      <span>{{ translations[currentLang].project.info.title }}</span>
                    </div>
                    <el-descriptions direction="vertical" :column="1" border>
                      <el-descriptions-item :label="translations[currentLang].project.info.framework">
                        <el-tag size="medium" effect="dark">{{ projectInfo.framework }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item :label="translations[currentLang].project.info.version">
                        <el-tag type="success" size="medium" effect="dark">{{ projectInfo.version }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item :label="translations[currentLang].project.info.size">
                        <el-tag type="warning" size="medium" effect="dark">{{ projectInfo.size }}</el-tag>
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </el-col>

                <el-col :span="16">
                  <el-card class="optimization-card tech-card" shadow="hover">
                    <div slot="header" class="tech-card-header">
                      <i class="el-icon-magic-stick"></i>
                      <span>{{ translations[currentLang].project.progress.title }}</span>
                    </div>
                    <div v-if="isOptimizing">
                      <el-steps :active="currentStep" finish-status="success" align-center class="tech-steps">
                        <el-step :title="translations[currentLang].project.progress.steps.analysis" icon="el-icon-document"></el-step>
                        <el-step :title="translations[currentLang].project.progress.steps.optimization" icon="el-icon-refresh"></el-step>
                        <el-step :title="translations[currentLang].project.progress.steps.resources" icon="el-icon-picture"></el-step>
                        <el-step :title="translations[currentLang].project.progress.steps.build" icon="el-icon-setting"></el-step>
                      </el-steps>

                      <div class="progress-container">
                        <el-progress 
                          :percentage="optimizationProgress"
                          :status="optimizationProgress === 100 ? 'success' : ''"
                          :stroke-width="8"
                          :show-text="true"
                        ></el-progress>
                        <div class="current-optimization" v-if="currentOptimization">
                          <p>
                            <i class="el-icon-loading" v-if="!optimizationComplete"></i>
                            {{ currentOptimization }}
                          </p>
                          <div class="file-list" v-if="currentFiles.length">
                            <div v-for="(file, index) in currentFiles" :key="index" class="file-item">
                              <i class="el-icon-document"></i>
                              {{ file }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>

              <!-- 优化对比部分 -->
              <div v-if="optimizationComplete" class="comparison-section animate__animated animate__fadeInUp">
                <el-card class="comparison-card" shadow="hover">
                  <div class="comparison-header">
                    <i class="el-icon-data-analysis"></i>
                    <span>{{ translations[currentLang].project.comparison.title }}</span>
                  </div>
                  <div class="comparison-grid">
                    <!-- 代码冗余率 -->
                    <div class="comparison-item before" :class="{ 'animate__animated animate__fadeInLeft': true }">
                      <div class="metric-label">{{ translations[currentLang].project.comparison.beforeRedundancy }}</div>
                      <div class="metric-value">{{ comparisonData.before.redundancyRate }}%</div>
                    </div>
                    <div class="comparison-item after" :class="{ 'animate__animated animate__fadeInRight': true }">
                      <div class="metric-label">{{ translations[currentLang].project.comparison.afterRedundancy }}</div>
                      <div class="metric-value improved">
                        {{ comparisonData.after.redundancyRate }}%
                        <span class="metric-change positive">
                          -{{ comparisonData.before.redundancyRate - comparisonData.after.redundancyRate }}%
                        </span>
                      </div>
                    </div>

                    <!-- 加载时间 -->
                    <div class="comparison-item before" :class="{ 'animate__animated animate__fadeInLeft': true, 'animate__delay-1s': true }">
                      <div class="metric-label">{{ translations[currentLang].project.comparison.beforeLoadTime }}</div>
                      <div class="metric-value">{{ comparisonData.before.loadTime }}s</div>
                    </div>
                    <div class="comparison-item after" :class="{ 'animate__animated animate__fadeInRight': true, 'animate__delay-1s': true }">
                      <div class="metric-label">{{ translations[currentLang].project.comparison.afterLoadTime }}</div>
                      <div class="metric-value improved">
                        {{ comparisonData.after.loadTime }}s
                        <span class="metric-change positive">
                          -{{ (comparisonData.before.loadTime - comparisonData.after.loadTime).toFixed(1) }}s
                        </span>
                      </div>
                    </div>

                    <!-- 安全问题 -->
                    <div class="comparison-item before" :class="{ 'animate__animated animate__fadeInLeft': true, 'animate__delay-2s': true }">
                      <div class="metric-label">{{ translations[currentLang].project.comparison.beforeSecurity }}</div>
                      <div class="metric-value">{{ comparisonData.before.securityIssues }}</div>
                    </div>
                    <div class="comparison-item after" :class="{ 'animate__animated animate__fadeInRight': true, 'animate__delay-2s': true }">
                      <div class="metric-label">{{ translations[currentLang].project.comparison.afterSecurity }}</div>
                      <div class="metric-value improved">
                        {{ comparisonData.after.securityIssues }}
                        <span class="metric-change positive">
                          -{{ comparisonData.before.securityIssues - comparisonData.after.securityIssues }}
                        </span>
                      </div>
                    </div>

                    <!-- 资源利用率 -->
                    <div class="comparison-item before" :class="{ 'animate__animated animate__fadeInLeft': true, 'animate__delay-3s': true }">
                      <div class="metric-label">{{ translations[currentLang].project.comparison.beforeResource }}</div>
                      <div class="metric-value">{{ comparisonData.before.resourceUtilization }}%</div>
                    </div>
                    <div class="comparison-item after" :class="{ 'animate__animated animate__fadeInRight': true, 'animate__delay-3s': true }">
                      <div class="metric-label">{{ translations[currentLang].project.comparison.afterResource }}</div>
                      <div class="metric-value improved">
                        {{ comparisonData.after.resourceUtilization }}%
                        <span class="metric-change positive">
                          +{{ comparisonData.after.resourceUtilization - comparisonData.before.resourceUtilization }}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 下载按钮 -->
                  <div class="download-section">
                    <el-button 
                      type="primary"
                      class="download-button"
                      @click="downloadOptimizedProject"
                      :loading="isDownloading"
                    >
                      <i class="el-icon-download"></i>
                      <span class="button-text">{{ translations[currentLang].project.download }}</span>
                    </el-button>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { Message } from 'element-ui'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export default {
  name: 'CodeOptimizer',
  data() {
    return {
      activeTab: 'optimization',
      activeSettings: ['1'],
      sourceCode: '',
      optimizedCode: '',
      loading: false,
      algorithmOptions: [],
      securityLayers: [],
      optimizationIntensity: 50,
      analysisCode: '',
      analyzing: false,
      analysisResults: null,
      charts: {
        quality: null,
        vulnerability: null
      },
      projectInfo: null,
      currentLang: 'zh',
      translations: {
        zh: {
          tabs: {
            optimization: '代码优化',
            analysis: '代码分析',
            project: '项目优化'
          },
          optimization: {
            title: '代码优化',
            algorithmOptions: '算法优化选项',
            dynamicProgramming: '动态规划',
            machineLearn: '机器学习',
            parallel: '并行计算',
            distributed: '分布式算法',
            intensity: '优化强度',
            securityOptions: '安全防御选项',
            inputValidation: '输入验证',
            xssProtection: 'XSS防护',
            sqlInjection: 'SQL注入防护',
            ddosProtection: 'DDoS防护',
            encryption: '数据加密',
            inputCode: '输入代码',
            placeholder: '请输入需要优化的代码...',
            optimize: '优化代码',
            clear: '清空',
            optimizedCode: '优化后的代码',
            copy: '复制代码',
            features: {
              smartOptimization: {
                title: '智能优化',
                description: '使用机器学习算法优化代码',
                icon: 'el-icon-magic-stick'
              },
              securityDetection: {
                title: '安全检测',
                description: '检测潜在的安全漏洞',
                icon: 'el-icon-warning'
              },
              performanceBoost: {
                title: '性能提升',
                description: '优化代码以提高性能',
                icon: 'el-icon-trophy'
              }
            },
            statistics: {
              optimization: {
                value: '90%',
                label: '平均优化率',
                icon: 'el-icon-data-line'
              },
              security: {
                value: '80%',
                label: '平均安全性提升',
                icon: 'el-icon-lock'
              },
              performance: {
                value: '70%',
                label: '平均性能提升',
                icon: 'el-icon-trophy'
              },
              quality: {
                value: '60%',
                label: '平均代码质量提升',
                icon: 'el-icon-medal'
              }
            }
          },
          analysis: {
            title: '代码分析',
            description: '输入您的代码，获取质量分析报告和优化建议',
            placeholder: '请输入需要分析的代码...',
            analyze: '分析代码',
            clear: '清空',
            emptyTitle: '开始您的代码分析',
            features: {
              quality: {
                title: '代码质量评分',
                desc: '从多个维度评估代码质量'
              },
              security: {
                title: '安全漏洞检测',
                desc: '识别潜在的安全风险'
              },
              optimization: {
                title: '优化建议',
                desc: '获取详细的改进建议'
              }
            },
            tips: {
              title: '使用提示',
              multiLanguage: '支持多种编程语言的代码分析',
              codeLength: '建议代码片段不要太长，以获得更准确的分析结果',
              reference: '分析结果仅供参考，具体优化方案请结合实际情况'
            },
            charts: {
              quality: '代码质量评分',
              vulnerability: '安全漏洞分布'
            },
            report: {
              title: '代码分析报告',
              score: '总体评分'
            }
          },
          project: {
            title: '项目优化',
            uploadTitle: '上传项目开始优化',
            dragText: '拖拽项目ZIP文件到此处',
            clickText: '或点击上传',
            fileType: '仅支持ZIP格式的项目文件',
            info: {
              title: '项目信息',
              framework: '项目框架',
              version: '框架版本',
              size: '项目大小'
            },
            progress: {
              title: '优化进度',
              steps: {
                analysis: '项目分析',
                optimization: '代码优化',
                resources: '资源处理',
                build: '构建优化'
              }
            },
            comparison: {
              title: '优化效果对比',
              beforeRedundancy: '优化前代码冗余率',
              afterRedundancy: '优化后代码冗余率',
              beforeLoadTime: '优化前加载时间',
              afterLoadTime: '优化后加载时间',
              beforeSecurity: '优化前安全问题数',
              afterSecurity: '优化后安全问题数',
              beforeResource: '优化前资源利用率',
              afterResource: '优化后资源利用率'
            },
            download: '下载优化后的项目'
          }
        },
        en: {
          tabs: {
            optimization: 'Code Optimization',
            analysis: 'Code Analysis',
            project: 'Project Optimization'
          },
          optimization: {
            title: 'Code Optimization',
            algorithmOptions: 'Algorithm Options',
            dynamicProgramming: 'Dynamic Programming',
            machineLearn: 'Machine Learning',
            parallel: 'Parallel Computing',
            distributed: 'Distributed Algorithm',
            intensity: 'Optimization Intensity',
            securityOptions: 'Security Options',
            inputValidation: 'Input Validation',
            xssProtection: 'XSS Protection',
            sqlInjection: 'SQL Injection Protection',
            ddosProtection: 'DDoS Protection',
            encryption: 'Encryption',
            inputCode: 'Input Code',
            placeholder: 'Please enter code to optimize...',
            optimize: 'Optimize Code',
            clear: 'Clear',
            optimizedCode: 'Optimized Code',
            copy: 'Copy Code',
            features: {
              smartOptimization: {
                title: 'Smart Optimization',
                description: 'Optimize code using machine learning algorithms',
                icon: 'el-icon-magic-stick'
              },
              securityDetection: {
                title: 'Security Detection',
                description: 'Detect potential security vulnerabilities',
                icon: 'el-icon-warning'
              },
              performanceBoost: {
                title: 'Performance Boost',
                description: 'Optimize code for better performance',
                icon: 'el-icon-trophy'
              }
            },
            statistics: {
              optimization: {
                value: '90%',
                label: 'Average Optimization Rate',
                icon: 'el-icon-data-line'
              },
              security: {
                value: '80%',
                label: 'Average Security Improvement',
                icon: 'el-icon-lock'
              },
              performance: {
                value: '70%',
                label: 'Average Performance Boost',
                icon: 'el-icon-trophy'
              },
              quality: {
                value: '60%',
                label: 'Average Code Quality Improvement',
                icon: 'el-icon-medal'
              }
            }
          },
          analysis: {
            title: 'Code Analysis',
            description: 'Input your code to get quality analysis report and optimization suggestions',
            placeholder: 'Please enter code to analyze...',
            analyze: 'Analyze Code',
            clear: 'Clear',
            emptyTitle: 'Start Your Code Analysis',
            features: {
              quality: {
                title: 'Code Quality Score',
                desc: 'Evaluate code quality from multiple dimensions'
              },
              security: {
                title: 'Security Vulnerability Detection',
                desc: 'Identify potential security risks'
              },
              optimization: {
                title: 'Optimization Suggestions',
                desc: 'Get detailed improvement suggestions'
              }
            },
            tips: {
              title: 'Usage Tips',
              multiLanguage: 'Supports code analysis for multiple programming languages',
              codeLength: 'Keep code snippets concise for more accurate analysis results',
              reference: 'Analysis results are for reference only, please consider actual conditions'
            },
            charts: {
              quality: 'Code Quality Score',
              vulnerability: 'Security Vulnerability Distribution'
            },
            report: {
              title: 'Code Analysis Report',
              score: 'Overall Score'
            }
          },
          project: {
            title: 'Project Optimization',
            uploadTitle: 'Upload Project to Start Optimization',
            dragText: 'Drag and drop project ZIP file here',
            clickText: 'or click to upload',
            fileType: 'Only ZIP format project files are supported',
            info: {
              title: 'Project Information',
              framework: 'Project Framework',
              version: 'Framework Version',
              size: 'Project Size'
            },
            progress: {
              title: 'Optimization Progress',
              steps: {
                analysis: 'Project Analysis',
                optimization: 'Code Optimization',
                resources: 'Resource Processing',
                build: 'Build Optimization'
              }
            },
            comparison: {
              title: 'Optimization Comparison',
              beforeRedundancy: 'Code Redundancy Rate Before',
              afterRedundancy: 'Code Redundancy Rate After',
              beforeLoadTime: 'Load Time Before',
              afterLoadTime: 'Load Time After',
              beforeSecurity: 'Security Issues Before',
              afterSecurity: 'Security Issues After',
              beforeResource: 'Resource Utilization Before',
              afterResource: 'Resource Utilization After'
            },
            download: 'Download Optimized Project'
          }
        }
      },
      comparisonData: {
        before: {
          redundancyRate: 30,
          loadTime: 2.5,
          securityIssues: 5,
          resourceUtilization: 60
        },
        after: {
          redundancyRate: 10,
          loadTime: 1.8,
          securityIssues: 1,
          resourceUtilization: 80
        }
      },
      isOptimizing: false,
      currentStep: 0,
      optimizationProgress: 0,
      optimizationComplete: false,
      isDownloading: false,
      optimizationDetails: [
        {
          content: '正在分析项目结构...',
          status: 'primary',
          timestamp: '进行中'
        },
        {
          content: '优化路由配置',
          status: 'success',
          timestamp: '已完成'
        },
        {
          content: '压缩静态资源',
          status: 'primary',
          timestamp: '等待中'
        },
        {
          content: '优化构建配置',
          status: 'primary',
          timestamp: '等待中'
        }
      ],
      currentOptimization: '',
      optimizationFiles: [
        {
          step: 0,
          files: [
            '/package.json - 分析项目依赖',
            '/src/main.js - 入口文件分析',
            '/src/router/index.js - 路由结构分析'
          ]
        },
        {
          step: 1,
          files: [
            '/src/components/* - 组件代码优化',
            '/src/views/* - 页面代码优化',
            '/src/store/* - 状态管理优化'
          ]
        },
        {
          step: 2,
          files: [
            '/src/assets/images/* - 图片资源压缩',
            '/src/assets/styles/* - 样式文件优化',
            '/public/* - 静态资源处理'
          ]
        },
        {
          step: 3,
          files: [
            '/vue.config.js - 构建配置优化',
            '/babel.config.js - 编译配置优化',
            '/.env.* - 环境配置优化'
          ]
        }
      ],
      currentFiles: [],
      projectFile: null,
      zip: null
    }
  },
  computed: {
    features() {
      const featureData = this.translations[this.currentLang].optimization.features;
      return [
        featureData.smartOptimization,
        featureData.securityDetection,
        featureData.performanceBoost
      ];
    },
    statistics() {
      const statsData = this.translations[this.currentLang].optimization.statistics;
      return [
        statsData.optimization,
        statsData.security,
        statsData.performance,
        statsData.quality
      ];
    }
  },
  methods: {
    switchLanguage(lang) {
      this.currentLang = lang;
      // Refresh charts if they exist
      this.$nextTick(() => {
        if (this.analysisResults) {
          this.initializeCharts();
        }
      });
    }
  }
}
</script>

<style scoped>
.code-optimizer {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.optimization-settings {
  margin-bottom: 20px;
}

.optimization-intensity {
  margin-top: 20px;
  padding: 0 20px;
}

.code-container {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.code-input {
  margin-bottom: 20px;
}

.code-input h3,
.code-output h3 {
  margin-bottom: 10px;
  color: #409EFF;
  font-size: 16px;
}

.action-buttons {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.code-output {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.output-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.el-textarea {
  font-family: Monaco, Consolas, 'Courier New', monospace;
}

.el-textarea__inner {
  font-size: 14px;
  line-height: 1.6;
  padding: 12px;
}

.analysis-container {
  padding: 20px;
}

.code-input-section {
  margin-bottom: 20px;
}

.action-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.chart-card {
  margin-bottom: 20px;
}

.analysis-report {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-table {
  margin-top: 10px;
}

/* 添加一些动画效果 */
.feature-item {
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .feature-list {
    flex-direction: column;
    align-items: center;
  }

  .feature-item {
    width: 100%;
    max-width: 280px;
  }
}

.analysis-container {
  padding: 20px;
}

.section-header {
  margin-bottom: 20px;
  text-align: center;
}

.section-header h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 8px;
}

.section-desc {
  color: #909399;
  font-size: 14px;
}

.code-input-section {
  margin-bottom: 20px;
}

.action-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-top: 20px;
}

.empty-state > i {
  font-size: 36px;
  color: #409EFF;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 30px;
}

.feature-list {
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
  flex-wrap: wrap;
  gap: 20px;
}

.feature-item.small {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: white;
  border-radius: 8px;
  width: 180px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.feature-item.small i {
  font-size: 18px;
  color: #409EFF;
  margin-right: 10px;
  margin-top: 2px;
}

.feature-item.small .feature-text h4 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 14px;
}

.feature-item.small .feature-text p {
  margin: 0;
  color: #606266;
  font-size: 12px;
}

.tips-card {
  margin-top: 30px;
  text-align: left;
}

.tips-content {
  color: #606266;
}

.tips-content p {
  margin: 10px 0;
  display: flex;
  align-items: center;
  font-size: 13px;
}

.tips-content i {
  color: #409EFF;
  margin-right: 8px;
}

.framework-detection {
  margin-bottom: 20px;
}

.detection-content {
  padding: 15px;
}

.detection-item {
  margin-bottom: 20px;
}

.detection-item:last-child {
  margin-bottom: 0;
}

.detection-item h4 {
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.detection-item h4 i {
  margin-right: 8px;
  color: #409EFF;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chart-card {
  margin-bottom: 20px;
}

.analysis-report {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-table {
  margin-top: 10px;
}

/* 添加一些动画效果 */
.feature-item.small {
  transition: transform 0.3s ease;
}

.feature-item.small:hover {
  transform: translateY(-3px);
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .feature-list {
    flex-direction: column;
    align-items: center;
  }

  .feature-item.small {
    width: 100%;
    max-width: 280px;
  }
}
.project-optimization {
  padding: 20px;
  position: relative;
  min-height: 100vh;
}

.tech-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a192f 100%);
  opacity: 0.02;
  pointer-events: none;
}

.tech-header {
  margin-bottom: 20px;
  position: relative;
}

.tech-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000;
  font-size: 20px;
  font-weight: bold;
}

.features-section {
  padding: 20px 0;
}

.feature-card {
  padding: 20px;
  text-align: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.feature-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #409EFF;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}

.feature-icon {
  font-size: 32px;
  color: #409EFF;
  z-index: 1;
}

.upload-area {
  padding: 30px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background: rgba(64, 158, 255, 0.02);
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #409EFF;
  background: rgba(64, 158, 255, 0.05);
}

.stats-section {
  margin-top: 30px;
}

.stat-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.tech-steps {
  margin: 30px 0;
}

.progress-container {
  margin-top: 40px;
  padding: 0 20px;
}

.el-step__title {
  font-size: 14px;
}

.el-step__icon {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.comparison-section {
  margin-top: 20px;
}

.comparison-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.comparison-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.comparison-item {
  padding: 15px;
  border-radius: 6px;
  transition: all 0.3s;
}

.comparison-item.before {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
}

.comparison-item.after {
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
}

.metric-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.metric-value.improved {
  color: #67c23a;
}

.metric-change {
  font-size: 12px;
  margin-left: 5px;
}

.metric-change.positive {
  color: #67c23a;
}

.download-button {
  width: 200px;
  height: 45px;
  background: #000 !important;
  color: #fff !important;
  border: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s;
}

.download-button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.download-button i {
  margin-right: 8px;
  font-size: 18px;
}

.button-text {
  font-size: 14px;
  font-weight: 500;
}

.animate__animated {
  animation-duration: 0.8s;
}

.tech-card {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.tech-card .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tech-steps {
  margin: 30px 0;
}

.progress-container {
  margin-top: 40px;
  padding: 0 20px;
}

.current-optimization {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.file-list {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e4e7ed;
}

.file-item {
  font-size: 12px;
  color: #606266;
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.file-item i {
  color: #409EFF;
}
</style>
