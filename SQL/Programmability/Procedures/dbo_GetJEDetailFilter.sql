SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
--- GetJEDetailFilter 53,'01','','','','','2016-11-24','2016-11-25','',1,'USD','','',0,'Posted',''

CREATE PROCEDURE [dbo].[GetJEDetailFilter]
(
@ProdId int ,
@ss1 nvarchAr(5),
@ss2 nvarchAr(10),
@ss3 nvarchAr(10),
@ss4 nvarchAr(10),
@ss5 nvarchAr(10),
@STARTDate date,
@EndDate date,
@VendorIds nvarchar(100),
@CompanyId int, 
@Currency nvarchar(5),
@Period nvarchar(20)
,@Source nvarchar(5)
,@SetId int,
@Type nvarchar(50)
,@DocumentNo nvarchar(50)
)
AS
BEGIN


	SET NOCOUNT ON;

	
	set @EndDate = cast(dateadd(day,2,@EndDate) as date);-- (DATEADD(day,2,@EndDate)
	

	if(@Period='0')
	begin
	 set @Period='';
	end
	

declare @strSQL nvarchar(4000) = '	select  JE.JournalEntryId, cast(JE.TransactionNumber as int) as TransactionNumber,CO.CompanyCode as CO, 
	isnull(JE.DebitTotal,0) as DebitTotal,ISNULL(JE.CreditTotal,0) as CreditTotal, isnull(JE.TotalLines,0) as TotalLines
	,''-'' as Vendor,''-'' as ThridParty,JE.Source,JE.CompanyId,JE.ClosePeriod,
	convert(varchar(10),JE.PostedDate,110) as PostedDate,JE.Description,JE.ReferenceNumber,
	CC.PeriodStatus,isnull(JE.DocumentNo,'''') as DocumentNo,isnull(JE.CurrentStatus,'''') as CurrentStatus, JE.SourceTable as SourceTable, JE.EntryDate as EntryDate
	from JournalEntry JE
	join Company CO on JE.CompanyId=CO.CompanyId
	left outer join ClosePeriod cc on cc.ClosePeriodId = JE.ClosePeriod
';
declare @ParamDefinition nvarchar(4000) = '
 @ProdId int,
 @ss1 nvarchAr(5),
 @ss2 nvarchAr(10),
 @ss3 nvarchAr(10),
 @ss4 nvarchAr(10),
 @ss5 nvarchAr(10),
 @STARTDate date,
 @EndDate date,
 @VendorIds nvarchar(100),
 @CompanyId int,
 @Currency nvarchar(5),
 @Period nvarchar(20),
 @Source nvarchar(5),
 @SetId int,
 @Type nvarchar(50),
 @DocumentNo nvarchar(50)';


begin

set @strSQL = @strSQL + ' JOIN (select JournalEntryID from journalEntrydetail JD ';

if @ss1 <> '' or @ss2 <> '' or @ss3 <> '' or @ss4 <> '' 
begin 
	set @strSQL = @strSQL + ' JOIN (
		select COAID from COA where (COA.ss1= @ss1 OR @ss1='''')
			and (COA.SS2=@ss2 OR @ss2='''')
			and (COA.ss3=@ss1 OR @ss3='''')
			and (COA.ss4=@ss4 OR @ss4='''')
		) COA on JD.COAID=COA.COAID'
end
if @VendorIDs <> ''
begin
	set @strSQL = @strSQL + ' JOIN (select VendorID from tblVendor where (vendorid in (select * FROM dbo.SplitCSV(@VendorIds,'','')) OR @VendorIds='''') V
		on JD.vendorID = V.VendorID'
end
if @Source <> ''
begin
	set @strSQL = @strSQL + ' and Source in (select * FROM dbo.SplitCSV(@Source,'','')) or @Source='''')';
end
if @Period <> ''
begin
	set @strSQL = @strSQL + ' and (JE.ClosePeriod in (select * FROM dbo.SplitCSV(@Period,'','')) or @Period='''')';
end
if @DocumentNo <> ''
begin
	set @strSQL = @strSQL + ' and (JE.DocumentNo = @DocumentNo OR @DocumentNo='''')';
end

set @strSQL = @strSQL + ' group by JournalEntryID) JDF on JE.JournalEntryID = JDF.JournalEntryID ';
set @strSQL = @strSQL + ' where JE.Prodid=@ProdId';
if @StartDate <> ''
begin
	set @strSQL = @strSQL + ' and JE.PostedDate >= @STARTDate ';
end 
if @EndDate <> ''
begin 
	set @strSQL = @strSQL + ' AND JE.PostedDate <= @EndDate';
end
set @strSQL = @strSQL + '
and JE.AuditStatus=@Type
order by TransactionNumber;'
;

end 
print @strSQL;

exec sp_Executesql @strSQL,@ParamDefinition
,@ProdId=@ProdId
,@ss1=@ss1
,@ss2=@ss2
,@ss3=@ss3
,@ss4=@ss4
,@ss5=@ss5
,@STARTDate=@STARTDate
,@EndDate=@EndDate
,@VendorIDs=@VendorIDs
,@CompanyId=@CompanyId
,@Currency=@Currency
,@Period=@Period
,@Source=@Source
,@SetId=@SetID
,@Type=@Type
,@DocumentNo=@DocumentNo
; 


end
GO