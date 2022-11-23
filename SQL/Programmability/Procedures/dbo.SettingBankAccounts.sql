SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[SettingBankAccounts]
@ProdId int,
@AccountType int,
@CompanyId int,
@Bankid int,
@ClearingType nvarchar(50),
@SegmentPosition int,
@COACode nvarchar(50),
@AccountName nvarchar(20)
AS
BEGIN
SET NOCOUNT ON;
declare @DT varchar(20);
declare @SegmentDT int,@CompanyCode nvarchar(5)
set @CompanyCode=(SELECT CompanyCode FROM Company WHERE CompanyID=@CompanyId)

if(@ClearingType='Account')
BEGIN
if(@AccountType>0)
BEGIN
if(@AccountType=4)
BEGIN
	SELECT distinct a.AccountCode as COANo,a.AccountCode as COACode,a.AccountId as COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM  tblaccounts a
	WHERE  a.Posting=1 and a.AccountTypeid=@AccountType and  a.AccountId  not in  
	(SELECT isnull(COAID,0) FROM AccountClearing  
	WHERE Type='Bank' and BankId<>@Bankid and Accountname=@AccountName and ProdId=@ProdId);
END
ELSE if (@AccountType=5)
BEGIN
if @AccountName='APClearing'
BEGIN
	SELECT  distinct a.AccountCode as COANo,a.AccountCode as COACode,a.AccountId as COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM  tblaccounts a
	WHERE  a.ProdId=@ProdId and a.Posting=1 and  a.AccountTypeid=@AccountType 
	and a.AccountId  not in (SELECT COAID  FROM AccountClearing  
	WHERE BankId<>@Bankid and accountname=@AccountName and ClearingType='Account');
END
ELSE
BEGIN
	SELECT  distinct a.AccountCode as COANo,a.AccountCode as COACode,a.AccountId as COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM  tblaccounts a
	WHERE  a.ProdId=@ProdId and a.Posting=1 and  a.AccountTypeid=@AccountType 
	and a.AccountId  not in (SELECT COAID  FROM AccountClearing  
	WHERE  CompanyId<>@Companyid and accountname=@AccountName and ClearingType='Account');
END
END
END
ELSE
BEGIN
	SELECT  distinct a.AccountCode as COANo,a.AccountCode as COACode,a.AccountId COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM  tblaccounts a
	WHERE  a.ProdId=@ProdId and a.Posting=1 and  a.AccountTypeid in(4,5);
END
END
ELSE
BEGIN
if(@SegmentPosition=0)
BEGIN
	SELECT SS1 as COANo,COACode,COAID,'' as COADescription  FROM COA  WHERE ss2='' and ProdID=@ProdID;
END
ELSE if(@SegmentPosition=1)
BEGIN
set @DT=(SELECT classification   FROM segment WHERE SegmentLevel=2 and Prodid=@ProdID);
If (@DT='Detail')
BEGIN
if (@AccountName='Apclearing')
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM COA inner Join tblaccounts a on a.AccountId=coa.AccountId
	WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing  
	WHERE ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid);
END
ELSE
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,'' as COADescription
	FROM COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing  
	WHERE ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId);
END
END
ELSE
BEGIN
	SELECT SS2 as COANo,COACode,COAID,'' as COADescription
	FROM COA  WHERE ParentCode=@COACode and ProdID=@ProdID;
END
END
ELSE if(@SegmentPosition=2)
BEGIN
set @DT=(SELECT classification   FROM segment WHERE SegmentLevel=3 and Prodid=@ProdID);
If (@DT='Detail')
BEGIN
if (@AccountName='Apclearing')
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription  FROM COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing  WHERE ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid);
END
ELSE
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription  FROM COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing  WHERE ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId);
END
END
ELSE
BEGIN
	SELECT SS3 as COANo,COACode,COAID,'' as COADescription  FROM COA 
	WHERE ParentCode=@COACode and ProdID=@ProdID;
END
END
ELSE if(@SegmentPosition=3)
BEGIN
set @DT=(SELECT classification   FROM segment WHERE SegmentLevel=4 and Prodid=@ProdID);
If (@DT='Detail')
BEGIN
if (@AccountName='Apclearing')
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
	WHERE ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid);
END
ELSE
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM COA inner Join tblaccounts a on a.AccountId=coa.AccountId
	WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
	WHERE ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId);
END
END
ELSE
BEGIN
	SELECT SS4 as COANo,COACode,COAID,'' as COADescription  FROM COA
	WHERE ParentCode=@COACode and ProdID=@ProdID;
END
END
ELSE if(@SegmentPosition=4)
BEGIN
set @DT=(SELECT classification   FROM segment WHERE SegmentLevel=5 and Prodid=@ProdID);
If (@DT='Detail')
BEGIN
if (@AccountName='Apclearing')
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription  FROM COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
	WHERE ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid);
END
ELSE
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription  FROM COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
	WHERE ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId);
END
END
ELSE
BEGIN
	SELECT SS5 as COANo,COACode,COAID,'' as COADescription  FROM COA 
	WHERE ParentCode=@COACode and ProdID=@ProdID;
END
END
ELSE if(@SegmentPosition=5)
BEGIN
set @DT=(SELECT classification   FROM segment WHERE SegmentLevel=6 and Prodid=@ProdID);
If (@DT='Detail')
BEGIN
if (@AccountName='Apclearing')
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
	 WHERE ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid);
END
ELSE
BEGIN
	SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
	FROM COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
	and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
	and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
	WHERE ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId);
END
END
ELSE
BEGIN
	SELECT SS6 as COANo,COACode,COAID,'' as COADescription  FROM COA
	WHERE ParentCode=@COACode and ProdID=@ProdID;
END
END
ELSE if(@SegmentPosition=6)
BEGIN
set @DT=(SELECT classification   FROM segment WHERE SegmentLevel=7 and Prodid=@ProdID);
If (@DT='Detail')
BEGIN
if (@AccountName='Apclearing')
	BEGIN
		SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
		FROM COA inner Join tblaccounts a
		on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
		and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
		and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
		 WHERE ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid);
	END
ELSE
	BEGIN
		SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
		FROM COA inner Join tblaccounts a
		on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
		and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
		and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
		WHERE ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId);
	END
END
ELSE
	BEGIN
		SELECT SS7 as COANo,COACode,COAID,'' as COADescription FROM COA 
		WHERE ParentCode=@COACode and ProdID=@ProdID;
	END
END
ELSE if(@SegmentPosition=7)
BEGIN
set @DT=(SELECT classification   FROM segment WHERE SegmentLevel=8 and Prodid=@ProdID);
If (@DT='Detail')
BEGIN
if (@AccountName='Apclearing')
	BEGIN
		SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
		FROM COA inner Join tblaccounts a
		on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
		and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
		and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing 
		WHERE ClearingType='COA' and AccountName=@AccountName and BankId<>@Bankid);
	END
ELSE
	BEGIN
		SELECT a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COADescription
		FROM COA inner Join tblaccounts a
		on a.AccountId=coa.AccountId   WHERE ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1 
		and	 coa.AccountTypeid=@AccountType and coa.SS1=@CompanyCode
		and COA.COAID  not  in (SELECT isnull(COAID,0)  FROM AccountClearing
		WHERE ClearingType='COA' and AccountName=@AccountName and CompanyId<>@CompanyId);
	END
END
ELSE
	BEGIN
		SELECT SS8 as COANo,COACode,COAID,'' as COADescription
		FROM COA  WHERE ParentCode=@COACode and ProdID=@ProdID and COAID not in(select COAId from AccountClearing where Type in('Bank','Payroll'));
	END
END
END
END

GO