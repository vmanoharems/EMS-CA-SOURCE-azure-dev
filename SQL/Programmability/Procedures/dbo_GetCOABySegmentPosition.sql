
CREATE PROCEDURE [dbo].[GetCOABySegmentPosition] -- GetCOABySegmentPosition '01|300',3,2
	-- Add the parameters for the stored procedure here
	@COACode nvarchar(200),
	@ProdId int,
	@SegmentPosition int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @DT varchar(20);
    -- Insert statements for procedure here
	if(@SegmentPosition=0)
		begin
			select SS1 as COANo,COACode,COAID  from COA  where ss2='' and ProdID=@ProdID order by COACode
		end
	else if(@SegmentPosition=1)
		begin
		set @DT=(select classification   from segment where SegmentLevel=2 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			ORDER BY A.AccountCode
			end
		else
			begin
			select SS2 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
			ORDER BY COA.SS2
			end
		end
	else if(@SegmentPosition=2)
		begin
		set @DT=(select classification   from segment where SegmentLevel=3 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			ORDER BY A.AccountCode
			end
		else
			begin
			select SS3 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
			ORDER BY COA.SS3
			end
		end
	else if(@SegmentPosition=3)
		begin
		set @DT=(select classification   from segment where SegmentLevel=4 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			ORDER BY A.AccountCode
			end
		else
			begin
			select SS4 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
			ORDER BY COA.SS4
			end
		end
	else if(@SegmentPosition=4)
		begin
		set @DT=(select classification   from segment where SegmentLevel=5 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			ORDER BY A.AccountCode
			end
		else
			begin
			select SS5 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
			ORDER BY COA.SS5
			end
		end
	else if(@SegmentPosition=5)
		begin
		set @DT=(select classification   from segment where SegmentLevel=6 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			ORDER BY A.AccountCode
			end
		else
			begin
			select SS6 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
			ORDER BY COA.SS6
			end
		end
	else if(@SegmentPosition=6)
		begin
		set @DT=(select classification   from segment where SegmentLevel=7 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			ORDER BY A.AccountCode
			end
		else
			begin
			select SS7 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
			ORDER BY COA.SS7
			end
		end
	else if(@SegmentPosition=7)
		begin
		set @DT=(select classification   from segment where SegmentLevel=8 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			ORDER BY A.AccountCode
			end
		else
			begin
			select SS8 as COANo,COACode,COAID  from COA  where ParentCode=@COACode and ProdID=@ProdID
			ORDER BY COA.SS8
			end
		end
END